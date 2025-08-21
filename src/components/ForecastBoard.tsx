// src/components/ForecastBoard.tsx
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  CartesianGrid,
} from 'recharts';
import type { MonthAgg } from '../lib/calendar';

type Props = { data: MonthAgg[] };

const rentalOf = (row: any) =>
  typeof row?.rental === 'number' ? row.rental :
  typeof row?.count === 'number'  ? row.count  : 0;

const num = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v) ? v : 0;

const ForecastBoard: React.FC<Props> = ({ data }) => {
  const rows = Array.isArray(data) ? data : [];

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>예측 임대 데이터 (2026–2040)</h3>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={rows} margin={{ top: 12, right: 24, bottom: 12, left: 12 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(m) => `${m}월`} interval={0} />

          <YAxis
            yAxisId="L"
            allowDecimals={false}
            domain={[0, (dataMax: number) => Math.ceil(num(dataMax) * 1.1)]}
            label={{ value: '예측 임대건수', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="R"
            orientation="right"
            domain={[0, (dataMax: number) => Math.ceil(num(dataMax) * 1.1)]}
            label={{ value: '강수(mm) / 기온(℃)', angle: -90, position: 'insideRight' }}
          />

          <Tooltip
            formatter={(value, name) => {
              if (name?.toString().includes('강수')) return [`${num(value)} mm`, name];
              if (name?.toString().includes('기온')) return [`${num(value)} ℃`, name];
              return [num(value), name];
            }}
            labelFormatter={(label) => `${label}월`}
          />
          <Legend />

          <Bar
            yAxisId="L"
            dataKey={(row) => rentalOf(row)}
            name="예측 임대건수"
            barSize={28}
            fill="#333"
          />
          <Line
            yAxisId="R"
            type="monotone"
            dataKey="rainfall"
            name="강수량(mm)"
            dot={{ r: 2 }}
            strokeWidth={2}
            stroke="#1f77b4"
          />
          <Line
            yAxisId="R"
            type="monotone"
            dataKey="avgTemp"
            name="평균기온(℃)"
            dot={{ r: 2 }}
            strokeWidth={2}
            strokeDasharray="4 2"
            stroke="#d62728"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(ForecastBoard);
