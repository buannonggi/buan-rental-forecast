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

// 공통 컨트롤 크기
const baseCtl = {
  fontSize: 18,
  lineHeight: 1.3,
} as const;

// 드롭다운
const selectStyle: React.CSSProperties = {
  ...baseCtl,
  height: 44,
  padding: '8px 12px',
  minWidth: 180,
  marginRight: 16,
  borderRadius: 8,
  border: '1px solid #d1d5db',
  background: '#fff',
};

// Boost/Base 숫자 입력 – 크게
const numberStyle: React.CSSProperties = {
  ...baseCtl,
  height: 56,
  fontSize: 22,
  width: 180,
  padding: '8px 14px',
  marginLeft: 8,
  marginRight: 24,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: '#fff',
};

// 체크박스
const checkboxStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  verticalAlign: 'middle',
  marginRight: 8,
};

const labelStyle: React.CSSProperties = {
  ...baseCtl,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  marginRight: 20,
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
        border: '1px solid #e5e7eb',   // 보드와 동일
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        background: '#fff',
      }}
    >
      <h2 style={{ margin: '0 0 12px 0', fontSize: 20 }}>임대예측 대시보드 (2015~2040)</h2>

      {/* 상단 스위치 + Boost/Base */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={useActualAdjust}
            onChange={(e) => onChangeUseActualAdjust(e.target.checked)}
            style={checkboxStyle}
          />
          실제 데이터 달력 보정
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={useForecastAdjust}
            onChange={(e) => onChangeUseForecastAdjust(e.target.checked)}
            style={checkboxStyle}
          />
          예측 데이터 달력 보정
        </label>

        <span style={{ ...baseCtl, marginLeft: 8 }}>Boost:</span>
        <input
          type="number"
          value={boost}
          step={0.05}
          onChange={(e) => onChangeBoost(Number(e.target.value))}
          style={numberStyle}
        />

        <span style={{ ...baseCtl }}>Base:</span>
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
          />
          연간 총량 유지
        </label>
      </div>

      {/* 실제/예측 선택 */}
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* 실제 */}
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>실제 데이터 선택 (2015~2025)</h3>
          <span style={baseCtl}>기종: </span>
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

          <span style={baseCtl}>년도: </span>
          <select
            value={actualYear}
            onChange={(e) => onChangeActualYear(Number(e.target.value))}
            style={{ ...selectStyle, minWidth: 140 }}
          >
            {yearsActual.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* 예측 */}
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>예측 데이터 선택 (2026~2040)</h3>
          <span style={baseCtl}>기종: </span>
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

          <span style={baseCtl}>년도: </span>
          <select
            value={forecastYear}
            onChange={(e) => onChangeForecastYear(Number(e.target.value))}
            style={{ ...selectStyle, minWidth: 140 }}
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
