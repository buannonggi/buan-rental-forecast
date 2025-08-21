// src/App.tsx
import React, { useEffect, useMemo, useState } from 'react';
import Controls from './components/Controls';
import ActualBoard from './components/ActualBoard';
import ForecastBoard from './components/ForecastBoard';
import {
  listMachines,
  listYears,
  loadTrainingRows,
  loadForecastRows,
  getMonthlyWithAdjustment,
  type RawRow,
} from './lib/data';
import type { MonthAgg } from './lib/calendar';

function App() {
  const [train, setTrain] = useState<RawRow[]>([]);
  const [forecast, setForecast] = useState<RawRow[]>([]);
  const [machines, setMachines] = useState<string[]>([]);
  const [yearsActual, setYearsActual] = useState<number[]>([]);
  const [yearsForecast, setYearsForecast] = useState<number[]>([]);
  const [actualMachine, setActualMachine] = useState('');
  const [actualYear, setActualYear] = useState<number>(2024);
  const [forecastMachine, setForecastMachine] = useState('');
  const [forecastYear, setForecastYear] = useState<number>(2030);
  const [useActualAdjust, setUseActualAdjust] = useState(false);
  const [useForecastAdjust, setUseForecastAdjust] = useState(true);
  const [boost, setBoost] = useState(1.2);
  const [base, setBase] = useState(0.9);
  const [preserveAnnualTotal, setPreserveAnnualTotal] = useState(true);

  useEffect(() => {
    (async () => {
      const tr = await loadTrainingRows();
      const fc = await loadForecastRows();
      setTrain(tr);
      setForecast(fc);

      const m = listMachines(tr);
      setMachines(m);
      setActualMachine(m[0] ?? '');
      setForecastMachine(m[0] ?? '');

      setYearsActual(listYears(tr));
      setYearsForecast(listYears(fc));
    })();
  }, []);

  const adjOpts = useMemo(
    () => ({
      useForActual: useActualAdjust,
      useForForecast: useForecastAdjust,
      boost,
      base,
      preserveAnnualTotal,
    }),
    [useActualAdjust, useForecastAdjust, boost, base, preserveAnnualTotal],
  );

  const [actualMonthly, setActualMonthly] = useState<MonthAgg[]>([]);
  const [forecastMonthly, setForecastMonthly] = useState<MonthAgg[]>([]);

  useEffect(() => {
    (async () => {
      if (!actualMachine || train.length === 0) {
        setActualMonthly([]);
        return;
      }
      const agg = await getMonthlyWithAdjustment(
        train,
        actualMachine,
        actualYear,
        false,
        adjOpts,
      );
      setActualMonthly(agg);
    })();
  }, [train, actualMachine, actualYear, adjOpts]);

  useEffect(() => {
    (async () => {
      if (!forecastMachine || forecast.length === 0) {
        setForecastMonthly([]);
        return;
      }
      const agg = await getMonthlyWithAdjustment(
        forecast,
        forecastMachine,
        forecastYear,
        true,
        adjOpts,
      );
      setForecastMonthly(agg);
    })();
  }, [forecast, forecastMachine, forecastYear, adjOpts]);

  const loading = machines.length === 0;

  return (
    <div style={{ padding: 12 }}>
      <h2>임대예측 대시보드 (2015~2040)</h2>

      <Controls
        machines={machines}
        yearsActual={yearsActual}
        yearsForecast={yearsForecast}
        actualMachine={actualMachine}
        actualYear={actualYear}
        forecastMachine={forecastMachine}
        forecastYear={forecastYear}
        useActualAdjust={useActualAdjust}
        useForecastAdjust={useForecastAdjust}
        boost={boost}
        base={base}
        preserveAnnualTotal={preserveAnnualTotal}
        onChangeActualMachine={setActualMachine}
        onChangeActualYear={setActualYear}
        onChangeForecastMachine={setForecastMachine}
        onChangeForecastYear={setForecastYear}
        onChangeUseActualAdjust={setUseActualAdjust}
        onChangeUseForecastAdjust={setUseForecastAdjust}
        onChangeBoost={setBoost}
        onChangeBase={setBase}
        onChangePreserveAnnual={setPreserveAnnualTotal}
      />

      {loading ? (
        <div style={{ padding: 16 }}>데이터 불러오는 중…</div>
      ) : (
        <>
          <div style={{ marginTop: 16 }}>
            <ActualBoard data={actualMonthly} />
          </div>
          <div style={{ marginTop: 16 }}>
            <ForecastBoard data={forecastMonthly} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
