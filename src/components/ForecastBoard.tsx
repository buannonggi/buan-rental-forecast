import React from 'react'
import {
  ResponsiveContainer, ComposedChart, XAxis, YAxis,
  Tooltip, Legend, Bar, Line, CartesianGrid
} from 'recharts'
import type { MonthAgg } from '../lib/data'

const ForecastBoard: React.FC<{ data: MonthAgg[] }> = ({ data }) => {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>예측 임대 데이터 (2026–2040)</h3>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data} margin={{ top: 12, right: 24, bottom: 12, left: 12 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(m) => `${m}월`} />
          <YAxis yAxisId="L" label={{ value: '예측 임대건수', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="R" orientation="right"
                 label={{ value: '강수(mm)/기온(℃)', angle: -90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Bar  yAxisId="L" dataKey="rental"   name="예측 임대건수" />
          <Line yAxisId="R" type="monotone" dataKey="rainfall" name="강수량(mm)" />
          <Line yAxisId="R" type="monotone" dataKey="avgTemp"  name="평균기온(℃)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ForecastBoard
