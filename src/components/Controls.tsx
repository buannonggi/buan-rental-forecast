// src/components/Controls.tsx
import React from 'react';

type Props = {
  machines: string[];
  yearsActual: number[];
  yearsForecast: number[];

  // 선택값 (App에서 내려주는 현재 상태)
  actualMachine: string;
  actualYear: number;
  forecastMachine: string;
  forecastYear: number;

  // 보정 옵션 (App에서 내려주는 현재 상태)
  useActualAdjust: boolean;
  useForecastAdjust: boolean;
  boost: number;
  base: number;
  preserveAnnualTotal: boolean;

  // 변경 핸들러 (App에서 내려주는 set 함수들)
  onChangeActualMachine: (m: string) => void;
  onChangeActualYear: (y: number) => void;
  onChangeForecastMachine: (m: string) => void;
  onChangeForecastYear: (y: number) => void;
  onChangeUseActualAdjust: (v: boolean) => void;
  onChangeUseForecastAdjust: (v: boolean) => void;
  onChangeBoost: (n: number) => void;
  onChangeBase: (n: number) => void;
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
        border: '1px solid #ddd',
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
        fontSize: '20px',
        lineHeight: 2,
      }}
    >
      <h2 style={{ marginBottom: 20 }}>임대예측 대시보드 (2015~2040)</h2>

      {/* 보정 옵션 */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 20 }}>
          <input
            type="checkbox"
            checked={useActualAdjust}
            onChange={(e) => onChangeUseActualAdjust(e.target.checked)}
            style={{ width: 20, height: 20 }}
          />{' '}
          실제 데이터 달력 보정
        </label>

        <label style={{ marginRight: 20 }}>
          <input
            type="checkbox"
            checked={useForecastAdjust}
            onChange={(e) => onChangeUseForecastAdjust(e.target.checked)}
            style={{ width: 20, height: 20 }}
          />{' '}
          예측 데이터 달력 보정
        </label>

        Boost:{' '}
        <input
          type="number"
          value={boost}
          step={0.05}
          onChange={(e) => onChangeBoost(Number(e.target.value))}
          style={{
            width: 100,
            height: 40,
            fontSize: '18px',
            marginLeft: 8,
            marginRight: 20,
          }}
        />
        Base:{' '}
        <input
          type="number"
          value={base}
          step={0.05}
          onChange={(e) => onChangeBase(Number(e.target.value))}
          style={{
            width: 100,
            height: 40,
            fontSize: '18px',
            marginLeft: 8,
            marginRight: 20,
          }}
        />

        <label>
          <input
            type="checkbox"
            checked={preserveAnnualTotal}
            onChange={(e) => onChangePreserveAnnual(e.target.checked)}
            style={{ width: 20, height: 20 }}
          />{' '}
          연간 총량 유지
        </label>
      </div>

      {/* 선택 영역 */}
      <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
        {/* 실제 데이터 선택 */}
        <div>
          <h3 style={{ marginBottom: 12 }}>실제 데이터 선택 (2015~2025)</h3>
          기종:{' '}
          <select
            value={actualMachine}
            onChange={(e) => onChangeActualMachine(e.target.value)}
            style={{
              fontSize: '18px',
              padding: '6px 12px',
              width: 180,
              height: 45,
              marginRight: 20,
            }}
          >
            {machines.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          년도:{' '}
          <select
            value={actualYear}
            onChange={(e) => onChangeActualYear(Number(e.target.value))}
            style={{
              fontSize: '18px',
              padding: '6px 12px',
              width: 140,
              height: 45,
            }}
          >
            {yearsActual.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* 예측 데이터 선택 */}
        <div>
          <h3 style={{ marginBottom: 12 }}>예측 데이터 선택 (2026~2040)</h3>
          기종:{' '}
          <select
            value={forecastMachine}
            onChange={(e) => onChangeForecastMachine(e.target.value)}
            style={{
              fontSize: '18px',
              padding: '6px 12px',
              width: 180,
              height: 45,
              marginRight: 20,
            }}
          >
            {machines.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          년도:{' '}
          <select
            value={forecastYear}
            onChange={(e) => onChangeForecastYear(Number(e.target.value))}
            style={{
              fontSize: '18px',
              padding: '6px 12px',
              width: 140,
              height: 45,
            }}
          >
            {yearsForecast.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Controls;
