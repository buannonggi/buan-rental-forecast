// src/lib/calendar.ts
export type MachineCalendar = Record<string, number[]>; // 예: { "트랙터":[3,4,5,9,10], ... }

export interface AdjustOptions {
  /** 실제(2015~2025) 데이터에 달력 보정을 적용할지 */
  useForActual?: boolean;
  /** 예측(2026~2040) 데이터에 달력 보정을 적용할지 */
  useForForecast?: boolean;
  /** 달력에 포함된 달에 곱할 계수 (기본 1.2) */
  boost?: number;
  /** 달력에 포함되지 않은 달에 곱할 계수 (기본 0.9) */
  base?: number;
  /** 보정 후에도 연간 총합을 원래와 동일하게 맞출지 (기본 true) */
  preserveAnnualTotal?: boolean;
}

export type MonthAgg = {
  month: number;     // 1~12
  rental: number;    // 임대 건수(혹은 확률/예측치)
  rainfall: number;  // 강수량
  avgTemp: number;   // 평균기온
};

/** JSON 달력 로딩 */
export async function loadMachineCalendar(): Promise<MachineCalendar> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/machine_calendar.json`);
  if (!res.ok) throw new Error(`machine_calendar.json을 불러오지 못했습니다: ${res.status}`);
  return res.json();
}

/** 내부 유틸: 1~12 → 0~11 index 로 변환 */
function toIdx(m: number) { return Math.max(0, Math.min(11, m - 1)); }

/** 내부 유틸: MonthAgg[] → 12칸 배열(없는 달은 0) */
function toSeries12(rows: MonthAgg[]): {
  rental: number[];
  rainfall: number[];
  avgTemp: number[];
} {
  const rental = Array(12).fill(0);
  const rainfall = Array(12).fill(0);
  const avgTemp = Array(12).fill(0);
  for (const r of rows) {
    const i = toIdx(r.month);
    rental[i] = r.rental ?? 0;
    rainfall[i] = r.rainfall ?? 0;
    avgTemp[i] = r.avgTemp ?? 0;
  }
  return { rental, rainfall, avgTemp };
}

/** 내부 유틸: 12칸 배열 → MonthAgg[] (month 1~12) */
function fromSeries12(
  src: MonthAgg[],
  rental: number[],
): MonthAgg[] {
  const byMonth = new Map<number, MonthAgg>();
  for (const r of src) byMonth.set(r.month, { ...r });

  const out: MonthAgg[] = [];
  for (let m = 1; m <= 12; m++) {
    const base = byMonth.get(m) ?? { month: m, rental: 0, rainfall: 0, avgTemp: 0 };
    out.push({ ...base, rental: rental[m - 1] ?? 0 });
  }
  return out;
}

/**
 * 핵심: 달력에 따라 월별 임대량(rental)만 가중치 적용
 * - calendar[machine]에 포함된 달은 boost, 그 외 달은 base 곱
 * - preserveAnnualTotal=true 이면, 보정 전/후 총합을 같게 스케일링
 */
export function applyCalendarAdjustment(
  src: MonthAgg[],
  machine: string,
  calendar: MachineCalendar,
  opts: AdjustOptions,
): MonthAgg[] {
  const boost = opts.boost ?? 1.2;
  const base  = opts.base ?? 0.9;
  const months = new Set((calendar[machine] ?? []).map(toIdx)); // 0~11

  const series = toSeries12(src);
  const beforeSum = series.rental.reduce((a, b) => a + b, 0);

  const adjusted = series.rental.map((v, i) => {
    const k = months.has(i) ? boost : base;
    return v * k;
  });

  if ((opts.preserveAnnualTotal ?? true) && beforeSum > 0) {
    const afterSum = adjusted.reduce((a, b) => a + b, 0);
    if (afterSum > 0) {
      const scale = beforeSum / afterSum;
      for (let i = 0; i < adjusted.length; i++) adjusted[i] *= scale;
    }
  }

  return fromSeries12(src, adjusted);
}
