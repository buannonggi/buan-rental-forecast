import Papa from 'papaparse'

/** CSV 한 줄 원본 타입 */
export type RawRow = {
  machine: string
  year: string | number
  month: string | number
  period: '1~10일' | '11~20일' | '21~말일'
  avgTemp: string | number
  rainfall: string | number
  rental_count?: string | number         // training에만 존재
  pred_rental_count?: string | number    // forecast에만 존재
}

/** 차트용 월집계 타입 (두 CSV 모두 여기에 맞춤) */
export type MonthAgg = {
  month: number
  rental: number
  rainfall: number
  avgTemp: number
}

/** 기간별 일수 (기온 가중평균용) */
export const PERIOD_LEN = (y: number, m: number, p: RawRow['period']) => {
  const daysInMonth = new Date(y, m, 0).getDate() // m: 1~12
  if (p === '1~10일') return 10
  if (p === '11~20일') return 10
  return daysInMonth - 20
}

/** dev/배포 모두 동작하는 상대 경로 */
const csvUrl = (file: string) => `data/${file}`

/** CSV 로더 (공통) */
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

/** 선택 리스트 유틸 */
export function listMachines(rows: RawRow[]): string[] {
  return Array.from(new Set(rows.map(r => r.machine))).sort()
}
export function listYears(rows: RawRow[]): number[] {
  return Array.from(new Set(rows.map(r => Number(r.year)))).sort((a, b) => a - b)
}

/** 월 단위 집계 (임대:합계, 강수:합계, 기온:일수 가중평균) */
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
