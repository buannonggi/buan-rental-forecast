import React from 'react'

type Props = {
  title?: string
  machines: string[]
  years: number[]
  selMachine: string
  selYear: number
  onMachine: (m: string) => void
  onYear: (y: number) => void
}

const Controls: React.FC<Props> = ({
  title,
  machines,
  years,
  selMachine,
  selYear,
  onMachine,
  onYear,
}) => {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, marginBottom: 12 }}>
      {title && <h3 style={{ margin: '0 0 8px' }}>{title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>기종</span>
          <select value={selMachine} onChange={(e) => onMachine(e.target.value)}>
            {machines.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>년도</span>
          <select value={selYear} onChange={(e) => onYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export default Controls
