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

// 공통 큰 컨트롤 스타일(드롭다운/기본 인풋용)
const bigCtl = {
  fontSize: 22,
  height: 56,
  padding: '10px 16px',
  lineHeight: 1.2,
} as const;

const selectStyle: React.CSSProperties = {
  ...bigCtl,
  minWidth: 200,
  marginRight: 20,
};

// Boost/Base 숫자 입력 전용(더 크게)
const numberStyle: React.CSSProperties = {
  ...bigCtl,
  width: 180,        // 가로 폭
  height: 64,        // 🔹 세로 높이 크게 (스핀 버튼도 같이 커짐)
  fontSize: 24,      // 숫자 크기
  padding: '8px 14px',
  marginLeft: 8,
  marginRight: 24,
};

const checkboxStyle: React.CSSProperties = {
  width: 26,
  height: 26,
  verticalAlign: 'middle',
};

const labelStyle: React.CSSProperties = {
  marginRight: 24,
  fontSize: 20,
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
        borderRadius: 16,
        padding: 28,
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 2,
      }}
    >
      <h2 style={{ marginBottom: 20 }}>임대예측 대시보드 (2015~2040)</h2>

      <div style={{ marginBottom: 22, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={useActualAdjust}
            onChange={(e) => onChangeUseActualAdjust(e.target.checked)}
            style={checkboxStyle}
          />{' '}
          실제 데이터 달력 보정
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={useForecastAdjust}
            onChange={(e) => onChangeUseForecastAdjust(e.target.checked)}
            style={checkboxStyle}
          />{' '}
          예측 데이터 달력 보정
        </label>

        <span style={{ fontSize: 20 }}>Boost:</span>
        <input
          type="number"
          value={boost}
          step={0.05}
          onChange={(e) => onChangeBoost(Number(e.target.value))}
          style={numberStyle}
        />

        <span style={{ fontSize: 20 }}>Base:</span>
        <input
          type="number"
          value={base}
          step={0.05}
          onChange={(e) => onChangeBase(Number(e.target.value))}
          style={numberStyle}
        />

        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={preserveAnnualTotal}
            onChange={(e) => onChangePreserveAnnual(e.target.checked)}
            style={checkboxStyle}
          />{' '}
          연간 총량 유지
        </label>
      </div>

      <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
        {/* 실제 데이터 선택 */}
        <div>
          <h3 style={{ marginBottom: 12 }}>실제 데이터 선택 (2015~2025)</h3>
          기종:{' '}
          <select
            value={actualMachine}
            onChange={(e) => onChangeActualMachine(e.target.value)}
            style={selectStyle}
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
            style={{ ...selectStyle, minWidth: 160 }}
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
            style={selectStyle}
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
            style={{ ...selectStyle, minWidth: 160 }}
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
