// src/lib/calendar.ts
export type CalendarMap = Record<string, number[]>;

const NORMALIZE_TARGET = 1;        // 연평균 가중치(=1로 정규화)
const DEFAULT_BOOST = 1.2;         // 달력에 포함된 월에 곱할 값
const DEFAULT_BASE  = 0.9;         // 달력에 없는 월에 곱할 값

// JSON 로드
export async function loadMachineCalendar(): Promise<CalendarMap> {
  const res = await fetch('data/machine_calendar.json');
  if (!res.ok) throw new Error('machine_calendar.json 로드 실패');
  return (await res.json()) as CalendarMap;
}

/**
 * 기종명을 달력 키와 대조해 가장 잘 맞는 키를 찾음
 * - 완전 일치 우선, 없으면 "포함" 매칭
 */
export function resolveCalendarKey(machineName: string, cal: CalendarMap): string | null {
  const keys = Object.keys(cal);
  // 완전 일치
  const exact = keys.find(k => k === machineName);
  if (exact) return exact;

  // 포함 일치 (괄호/공백/하이픈 등 잡스러운 표기를 커버)
  const normalized = machineName.replace(/\s|\(|\)|\-|_/g, '');
  const hit = keys.find(k => normalized.includes(k.replace(/\s|\(|\)|\-|_/g, '')));
  return hit ?? null;
}

/**
 * 월별 값 배열을 달력 가중치로 보정
 * - months: 1~12
 * - values: 월별 임대량(숫자)
 * - calMonths: 달력에 등록된 '집중 사용 월' (예: [6,7,8])
 * - normalize: 연합이 유지되도록 평균 1.0으로 정규화
 */
export function applyCalendarWeights(
  months: number[],
  values: number[],
  calMonths: number[] | null,
  opts?: { boost?: number; base?: number; normalize?: boolean }
): number[] {
  const boost = opts?.boost ?? DEFAULT_BOOST;
  const base  = opts?.base  ?? DEFAULT_BASE;
  const normalize = opts?.normalize ?? true;

  // 달력 매칭이 없으면 원본 반환
  if (!calMonths || calMonths.length === 0) return values;

  // 원시 가중치
  const weights = months.map(m => (calMonths.includes(m) ? boost : base));

  // 정규화 (연평균이 1이 되도록)
  let normWeights = weights;
  if (normalize) {
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    const factor = avg === 0 ? 1 : NORMALIZE_TARGET / avg;
    normWeights = weights.map(w => w * factor);
  }

  // 곱해서 반환
  return values.map((v, i) => v * normWeights[i]);
}
