// src/App.tsx
import React, { useEffect, useMemo, useState } from 'react'
import Controls from './components/Controls'
import ActualBoard from './components/ActualBoard'
import ForecastBoard from './components/ForecastBoard'
import {
  RawRow, MonthAgg,
  loadTrainingData, loadForecastData,
  listMachines, listYears, aggregateMonthly,
} from './lib/data'
import { loadMachineCalendar, type CalendarMap } from './lib/calendar'
import { adjustWithCalendar } from './lib/data'

export default function App() {
  const [trainRows, setTrainRows] = useState<RawRow[]>([])
  const [predRows, setPredRows] = useState<RawRow[]>([])
  const [calendar, setCalendar] = useState<CalendarMap | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>('')

  // 보정 on/off 및 강도
  const [useAdjustActual, setUseAdjustActual] = useState(false)
  const [useAdjustForecast, setUseAdjustForecast] = useState(true) // 예측은 기본 켬
  const [boost, setBoost] = useState(1.2)
  const [base, setBase] = useState(0.9)

  useEffect(() => {
    (async () => {
      try {
        const [t, p] = await Promise.all([
          loadTrainingData(),
          loadForecastData(),
        ])
        setTrainRows(t); setPredRows(p)

        // 농사달력 로드
        const cal = await loadMachineCalendar()
        setCalendar(cal)
      } catch (e: any) {
        setErr(e?.message ?? '데이터 로딩 실패')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const machinesActual = useMemo(() => listMachines(trainRows), [trainRows])
  const yearsActual = useMemo(() => listYears(trainRows), [trainRows])
  const machinesForecast = useMemo(() => listMachines(predRows), [predRows])
  const yearsForecast = useMemo(() => listYears(predRows), [predRows])

  const [selMachineA, setSelMachineA] = useState('')
  const [selYearA, setSelYearA] = useState<number>(2025)
  const [selMachineF, setSelMachineF] = useState('')
  const [selYearF, setSelYearF] = useState<number>(2026)

  useEffect(() => {
    if (!selMachineA && machinesActual.length) setSelMachineA(machinesActual[0])
    if (yearsActual.length) setSelYearA(yearsActual[yearsActual.length - 1])
  }, [machinesActual, yearsActual, selMachineA])

  useEffect(() => {
    if (!selMachineF && machinesForecast.length) setSelMachineF(machinesForecast[0])
    if (yearsForecast.length) setSelYearF(yearsForecast[0])
  }, [machinesForecast, yearsForecast, selMachineF])

  const actualMonthly: MonthAgg[] = useMemo(() => {
    const m = selMachineA ? aggregateMonthly(trainRows, selYearA, selMachineA, false) : []
    if (!useAdjustActual) return m
    return adjustWithCalendar(m, selMachineA, calendar, { boost, base, normalize: true })
  }, [trainRows, selYearA, selMachineA, useAdjustActual, calendar, boost, base])

  const predMonthly: MonthAgg[] = useMemo(() => {
    const m = selMachineF ? aggregateMonthly(predRows, selYearF, selMachineF, true) : []
    if (!useAdjustForecast) return m
    return adjustWithCalendar(m, selMachineF, calendar, { boost, base, normalize: true })
  }, [predRows, selYearF, selMachineF, useAdjustForecast, calendar, boost, base])

  if (loading) return <div style={{ padding: 24 }}>불러오는 중…</div>
  if (err) return <div style={{ padding: 24, color: '#ef4444' }}>오류: {err}</div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>임대예측 대시보드 (2015–2040)</h1>

      {/* 보정 옵션 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={useAdjustActual} onChange={e => setUseAdjustActual(e.target.checked)} />
          <span>실제 데이터 달력 보정</span>
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={useAdjustForecast} onChange={e => setUseAdjustForecast(e.target.checked)} />
          <span>예측 데이터 달력 보정</span>
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          Boost
          <input type="number" step="0.05" value={boost} onChange={e => setBoost(Number(e.target.value) || 1.2)} style={{ width: 70 }} />
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          Base
          <input type="number" step="0.05" value={base} onChange={e => setBase(Number(e.target.value) || 0.9)} style={{ width: 70 }} />
        </label>
      </div>

      {/* 실제 */}
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

      {/* 예측 */}
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
        ※ 달력 보정은 월별 분포를 농사달력과 정합되게 조정합니다(연간 합은 유사하게 유지).
      </p>
    </div>
  )
}
