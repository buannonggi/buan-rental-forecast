// src/lib/data.ts
import Papa from 'papaparse';
import {
  applyCalendarAdjustment,
  loadMachineCalendar,
  type AdjustOptions,
  type MonthAgg,
} from '../lib/calendar';

/** 원시 CSV 스키마 */
export type RawRow = {
  machine: string;
  year: string | number;
  month: string | number;
  period: '1~10일' | '11~20일' | '21~말일';
  avgTemp: string | number;
  rainfall: string | number;
  /** 실제 CSV에서 사용하는 열 이름 (학습) */
  rental_count?: string | number;
  /** 예측 CSV에서 사용하는 열 이름 (예측) */
  pred_rental_count?: string | number;
};

const csvUrl = (file: string) => `${import.meta.env.BASE_URL}data/${file}`;

/** CSV 로딩 */
async function loadCSV(file: string): Promise<RawRow[]> {
  const url = csvUrl(file);
  const text = await fetch(url).then((r) => {
    if (!r.ok) throw new Error(`CSV를 불러오지 못했습니다: ${url} (${r.status})`);
    return r.text();
  });
  const { data } = Papa.parse<RawRow>(text, { header: true, skipEmptyLines: true });
  return data as RawRow[];
}

/** 월 일수(기간 가중치 계산용) */
export const PERIOD_LEN = (y: number, m: number, period: RawRow['period']) => {
  const daysInMonth = new Date(y, m, 0).getDate(); // m: 1~12
  if (period === '1~10일') return 10;
  if (period === '11~20일') return 10;
  return daysInMonth - 20; // '21~말일'
};

/** 유틸: 기종 목록 */
export function listMachines(rows: RawRow[]): string[] {
  return Array.from(new Set(rows.map((r) => r.machine))).sort();
}

/** 유틸: 연도 목록 */
export function listYears(rows: RawRow[]): number[] {
  return Array.from(new Set(rows.map((r) => Number(r.year)))).sort((a, b) => a - b);
}

/** 1년/1기종/실제/예측 단위 집계 (MonthAgg[12]) */
export function aggregateMonthly(
  rows: RawRow[],
  targetYear: number,
  machine: string,
  isForecast: boolean,
): MonthAgg[] {
  const out: MonthAgg[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthRows = rows.filter(
      (r) => Number(r.year) === targetYear && r.machine === machine && Number(r.month) === m,
    );
    let rental = 0;
    let rainfall = 0;
    let avgTemp = 0;

    // 기간 가중평균 (임대는 기간 길이 가중 합계)
    let rainSum = 0,
      tempSum = 0,
      lenSum = 0;
    for (const r of monthRows) {
      const len = PERIOD_LEN(targetYear, m, r.period);
      const rentVal = Number(isForecast ? r.pred_rental_count ?? 0 : r.rental_count ?? 0);
      rental += rentVal;

      const rain = Number(r.rainfall ?? 0);
      const tmp = Number(r.avgTemp ?? 0);
      rainSum += rain * len;
      tempSum += tmp * len;
      lenSum += len;
    }

    if (lenSum > 0) {
      rainfall = rainSum / lenSum;
      avgTemp = tempSum / lenSum;
    }

    out.push({ month: m, rental, rainfall, avgTemp });
  }
  return out;
}

/** 실제(2015~2025) CSV 로더 */
export async function loadTrainingRows() {
  return loadCSV('training_2015_2025_by_machine.csv');
}

/** 예측(2026~2040) CSV 로더 */
export async function loadForecastRows() {
  return loadCSV('forecast_2026_2040_by_machine.csv');
}

/**
 * 보정까지 한 번에 가져오는 헬퍼
 */
export async function getMonthlyWithAdjustment(
  rows: RawRow[],
  machine: string,
  year: number,
  isForecast: boolean,
  opts?: AdjustOptions,
): Promise<MonthAgg[]> {
  const agg = aggregateMonthly(rows, year, machine, isForecast);

  const wantAdj = isForecast ? opts?.useForForecast ?? false : opts?.useForActual ?? false;

  if (!wantAdj) return agg;

  const cal = await loadMachineCalendar();
  return applyCalendarAdjustment(agg, machine, cal, {
    boost: opts?.boost,
    base: opts?.base,
    preserveAnnualTotal: opts?.preserveAnnualTotal ?? true,
  });
}
