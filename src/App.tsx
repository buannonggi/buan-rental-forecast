import React, { useEffect, useMemo, useState } from 'react'
import Controls from './components/Controls'
import ActualBoard from './components/ActualBoard'
import ForecastBoard from './components/ForecastBoard'
import {
  RawRow,
  MonthAgg,
  loadTrainingData,
  loadForecastData,
  listMachines,
  listYears,
  aggregateMonthly,
} from './lib/data'

export default function App() {
  const [trainRows, setTrainRows] = useState<RawRow[]>([])
  const [predRows, setPredRows] = useState<RawRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const [t, p] = await Promise.all([loadTrainingData(), loadForecastData()])
        setTrainRows(t)
        setPredRows(p)
      } catch (e: any) {
        setErr(e?.message ?? '데이터 로딩 실패')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // 실제/예측 각각의 기종 목록 & 연도 목록
  const machinesActual = useMemo(() => listMachines(trainRows), [trainRows])
  const yearsActual = useMemo(() => listYears(trainRows), [trainRows])

  const machinesForecast = useMemo(() => listMachines(predRows), [predRows])
  const yearsForecast = useMemo(() => listYears(predRows), [predRows])

  // 실제(Actual) 선택 상태
  const [selMachineA, setSelMachineA] = useState('')
  const [selYearA, setSelYearA] = useState<number>(2025)

  // 예측(Forecast) 선택 상태
  const [selMachineF, setSelMachineF] = useState('')
  const [selYearF, setSelYearF] = useState<number>(2026)

  // 초기값 세팅 (목록이 준비되면 첫 값/최신 값으로)
  useEffect(() => {
    if (!selMachineA && machinesActual.length) setSelMachineA(machinesActual[0])
    if (yearsActual.length) setSelYearA(yearsActual[yearsActual.length - 1])
  }, [machinesActual, yearsActual, selMachineA])

  useEffect(() => {
    if (!selMachineF && machinesForecast.length) setSelMachineF(machinesForecast[0])
    if (yearsForecast.length) setSelYearF(yearsForecast[0]) // 보통 2026부터 시작
  }, [machinesForecast, yearsForecast, selMachineF])

  // 각 보드에 들어갈 월집계
  const actualMonthly: MonthAgg[] = useMemo(
    () => (selMachineA ? aggregateMonthly(trainRows, selYearA, selMachineA, false) : []),
    [trainRows, selYearA, selMachineA],
  )
  const predMonthly: MonthAgg[] = useMemo(
    () => (selMachineF ? aggregateMonthly(predRows, selYearF, selMachineF, true) : []),
    [predRows, selYearF, selMachineF],
  )

  if (loading) return <div style={{ padding: 24 }}>불러오는 중…</div>
  if (err) return <div style={{ padding: 24, color: '#ef4444' }}>오류: {err}</div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>임대예측 대시보드 (2015–2040)</h1>

      {/* 실제 데이터용 컨트롤 + 보드 */}
      <Controls
        title="실제 데이터 선택 (2015–2025)"
        machines={machinesActual}
        years={yearsActual}
        selMachine={selMachineA}
        selYear={selYearA}
        onMachine={setSelMachineA}
        onYear={setSelYearA}
      />
      <ActualBoard data={actualMonthly} />

      {/* 예측 데이터용 컨트롤 + 보드 */}
      <Controls
        title="예측 데이터 선택 (2026–2040)"
        machines={machinesForecast}
        years={yearsForecast}
        selMachine={selMachineF}
        selYear={selYearF}
        onMachine={setSelMachineF}
        onYear={setSelYearF}
      />
      <ForecastBoard data={predMonthly} />

      <p style={{ color: '#6b7280', marginTop: 16 }}>
        ※ 실제: 2015–2025, 예측: 2026–2040 범위의 CSV를 사용합니다.
      </p>
    </div>
  )
}
