// src/components/Controls.tsx
import React from 'react';

type Props = {
  machines: string[];
  yearsActual: number[];
  yearsForecast: number[];

  actualMachine: string;
  actualYear: number;
  forecastMachine: string;
  forecastYear: number;

  useActualAdjust: boolean;
  useForecastAdjust: boolean;
  boost: number;
  base: number;
  preserveAnnualTotal: boolean;

  onChangeActualMachine: (m: string) => void;
  onChangeActualYear: (y: number) => void;
  onChangeForecastMachine: (m: string) => void;
  onChangeForecastYear: (y: number) => void;
  onChangeUseActualAdjust: (v: boolean) => void;
  onChangeUseForecastAdjust: (v: boolean) => void;
  onChangeBoost: (v: number) => void;
  onChangeBase: (v: number) => void;
  onChangePreserveAnnual: (v: boolean) => void;
};

const Controls: React.FC<Props> = ({
  machines,
  yearsActual,
  yearsForecast,
  actualMachine,
  actualYear,
  forecastMachine,
  forecastYear,
  useActualAdjust,
  useForecastAdjust,
  boost,
  base,
  preserveAnnualTotal,
  onChangeActualMachine,
  onChangeActualYear,
  onChangeForecastMachine,
  onChangeForecastYear,
  onChangeUseActualAdjust,
  onChangeUseForecastAdjust,
  onChangeBoost,
  onChangeBase,
  onChangePreserveAnnual,
}) => {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        background: '#fff',
        fontSize: '18px',
        lineHeight: 1.6,
      }}
    >
      <h2 style={{ marginBottom: 16 }}>임대예측 대시보드 (2015~2040)</h2>

      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={useActualAdjust}
            onChange={(e) => onChangeUseActualAdjust(e.target.checked)}
            style={{ width: 20, height: 20, marginRight: 6 }}
          />
          실제 데이터 달력 보정
        </label>

        <label>
          <input
            type="checkbox"
            checked={useForecastAdjust}
            onChange={(e) => onChangeUseForecastAdjust(e.target.checked)}
            style={{ width: 20, height: 20, marginRight: 6 }}
          />
          예측 데이터 달력 보정
        </label>

        Boost:
        <input
          type="number"
          value={boost}
          step={0.05}
          onChange={(e) => onChangeBoost(Number(e.target.value))}
          style={{ width: 120, height: 44, fontSize: 18, marginLeft: 6, marginRight: 20 }}
        />

        Base:
        <input
          type="number"
          value={base}
          step={0.05}
          onChange={(e) => onChangeBase(Number(e.target.value))}
          style={{ width: 120, height: 44, fontSize: 18, marginLeft: 6, marginRight: 20 }}
        />

        <label>
          <input
            type="checkbox"
            checked={preserveAnnualTotal}
            onChange={(e) => onChangePreserveAnnual(e.target.checked)}
            style={{ width: 20, height: 20, marginRight: 6 }}
          />
          연간 총량 유지
        </label>
      </div>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* 실제 데이터 선택 */}
        <div>
          <h3 style={{ marginBottom: 8 }}>실제 데이터 선택 (2015~2025)</h3>
          기종:
          <select
            value={actualMachine}
            onChange={(e) => onChangeActualMachine(e.target.value)}
            style={{ fontSize: 16, padding: '6px 12px', width: 180, height: 40, marginLeft: 6, marginRight: 12 }}
          >
            {machines.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          년도:
          <select
            value={actualYear}
            onChange={(e) => onChangeActualYear(Number(e.target.value))}
            style={{ fontSize: 16, padding: '6px 12px', width: 120, height: 40, marginLeft: 6 }}
          >
            {yearsActual.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* 예측 데이터 선택 */}
        <div>
          <h3 style={{ marginBottom: 8 }}>예측 데이터 선택 (2026~2040)</h3>
          기종:
          <select
            value={forecastMachine}
            onChange={(e) => onChangeForecastMachine(e.target.value)}
            style={{ fontSize: 16, padding: '6px 12px', width: 180, height: 40, marginLeft: 6, marginRight: 12 }}
          >
            {machines.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          년도:
          <select
            value={forecastYear}
            onChange={(e) => onChangeForecastYear(Number(e.target.value))}
            style={{ fontSize: 16, padding: '6px 12px', width: 120, height: 40, marginLeft: 6 }}
          >
            {yearsForecast.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Controls;
