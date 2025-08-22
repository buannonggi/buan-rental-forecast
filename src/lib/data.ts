// src/lib/data.ts
import Papa from 'papaparse'
import type { CalendarMap } from './calendar'
import { resolveCalendarKey, applyCalendarWeights } from './calendar'

/** CSV 한 줄(원본) 타입 */
export type RawRow = {
  machine: string
  year: string | number
  month: string | number
  period: '1~10일' | '11~20일' | '21~말일'
  avgTemp: string | number
  rainfall: string | number
  rental_count?: string | number           // 학습(실제) CSV 전용
  pred_rental_count?: string | number      // 예측 CSV 전용
}

/** 차트/집계용 월 단위 타입 */
export type MonthAgg = {
  month: number
  rental: number
  rainfall: number
  avgTemp: number
}

/** 기간별 일수 (기온 가중평균 계산용) */
export const PERIOD_LEN = (y: number, m: number, p: RawRow['period']) => {
  const daysInMonth = new Date(y, m, 0).getDate() // m: 1~12
  if (p === '1~10일') return 10
  if (p === '11~20일') return 10
  return daysInMonth - 20
}

/** dev/배포 모두 동작하는 상대 경로 */
const csvUrl = (file: string) => `data/${file}`

/** CSV 공통 로더 */
export async function loadCSV(file: string): Promise<RawRow[]> {
  const text = await fetch(csvUrl(file)).then(r => {
    if (!r.ok) throw new Error(`CSV 로드 실패: ${file} (${r.status})`)
    return r.text()
  })
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })
  return data as RawRow[]
}

/** 편의 로더 */
export const loadTrainingData = () => loadCSV('training_2015_2025_by_machine.csv')
export const loadForecastData = () => loadCSV('forecast_2026_2040_by_machine.csv')

/** 선택 옵션 유틸 */
export function listMachines(rows: RawRow[]): string[] {
  return Array.from(new Set(rows.map(r => r.machine))).sort()
}
export function listYears(rows: RawRow[]): number[] {
  return Array.from(new Set(rows.map(r => Number(r.year)))).sort((a, b) => a - b)
}

/**
 * 월 단위 집계
 * - rental: 합계
 * - rainfall: 합계
 * - avgTemp: 기간 일수 가중평균
 */
export function aggregateMonthly(
  rows: RawRow[],
  targetYear: number,
  machine: string,
  isForecast = false
): MonthAgg[] {
  const filtered = rows.filter(r => Number(r.year) === targetYear && r.machine === machine)
  const map = new Map<number, { rent: number; rain: number; tempW: number; wSum: number }>()

  for (const r of filtered) {
    const y = Number(r.year)
    const m = Number(r.month)
    const len = PERIOD_LEN(y, m, r.period)

    const rent = Number(isForecast ? r.pred_rental_count ?? 0 : r.rental_count ?? 0)
    const rain = Number(r.rainfall ?? 0)
    const temp = Number(r.avgTemp ?? 0)

    const prev = map.get(m) ?? { rent: 0, rain: 0, tempW: 0, wSum: 0 }
    prev.rent += rent
    prev.rain += rain
    prev.tempW += temp * len
    prev.wSum += len
    map.set(m, prev)
  }

  const out: MonthAgg[] = []
  for (let m = 1; m <= 12; m++) {
    const v = map.get(m)
    out.push({
      month: m,
      rental: v?.rent ?? 0,
      rainfall: v?.rain ?? 0,
      avgTemp: v && v.wSum ? v.tempW / v.wSum : 0,
    })
  }
  return out
}

/**
 * 달력 가중치 보정
 * - monthly: aggregateMonthly 결과
 * - machineName: 현재 선택된 기종명 (리스트에서 그대로 전달)
 * - calendar: loadMachineCalendar()로 로드한 JSON 맵
 * - opts: { boost, base, normalize } (기본 boost=1.2, base=0.9, 연평균=1로 정규화)
 *
 * 결과: rental 값만 가중치로 보정하여 반환 (rainfall/avgTemp는 그대로 유지)
 */
export function adjustWithCalendar(
  monthly: MonthAgg[],
  machineName: string,
  calendar: CalendarMap | null,
  opts?: { boost?: number; base?: number; normalize?: boolean }
): MonthAgg[] {
  if (!calendar || monthly.length === 0) return monthly

  // 달력 키 매칭 (완전일치 우선, 없으면 부분일치)
  const calKey = resolveCalendarKey(machineName, calendar)
  if (!calKey) return monthly

  const calMonths = calendar[calKey] // 예: [6,7,8]
  if (!calMonths || calMonths.length === 0) return monthly

  const months = monthly.map(d => d.month)
  const rentals = monthly.map(d => d.rental)

  const adjusted = applyCalendarWeights(months, rentals, calMonths, opts)

  return monthly.map((d, i) => ({
    ...d,
    rental: adjusted[i],
  }))
}
