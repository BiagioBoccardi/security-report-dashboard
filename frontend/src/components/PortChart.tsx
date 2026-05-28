import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { PortData } from '@/types/report'

interface Props { ports: Record<string, PortData> }

export const PortChart: React.FC<Props> = ({ ports }) => {
  const data = Object.entries(ports).map(([port, d]) => ({ port, count: d.n })).sort((a, b) => b.count - a.count).slice(0, 10)

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl p-6 shadow-lg">
      <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold mb-4">Porte Esposte (Top 10)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--c-grid)" />
          <XAxis dataKey="port" tick={{ fill: 'var(--c-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--c-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--tt-bg)', border: '1px solid var(--tt-border)', color: 'var(--tt-text)', borderRadius: 8 }} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" fill="#f97316" name="Istanze" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
