import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { api } from '@/services/api'
import type { AnalyticsData } from '@/types/report'

interface Props { reportId: string }

function scoreColor(v: number): string {
  if (v >= 80) return '#ef4444'
  if (v >= 60) return '#f97316'
  if (v >= 40) return '#eab308'
  return '#22c55e'
}

export const RiskTrendChart: React.FC<Props> = ({ reportId }) => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAnalytics(reportId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [reportId])

  const trend = data?.risk_trend ?? []
  const current = trend[trend.length - 1]?.score ?? 0
  const previous = trend[0]?.score ?? current
  const delta = current - previous
  const lineColor = scoreColor(current)

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold">Risk Score — Trend 7 giorni</h3>
          <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-0.5">Evoluzione del punteggio di rischio</p>
        </div>
        {!loading && (
          <div className="text-right">
            <span style={{ color: lineColor }} className="text-2xl font-black">{current}</span>
            <span style={{ color: delta > 0 ? '#ef4444' : '#22c55e' }} className="text-xs font-bold ml-2">
              {delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${delta}` : '→ stabile'}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ backgroundColor: 'var(--bg-card-hi)' }} className="h-64 rounded-xl animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--c-grid)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--c-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={d => d.slice(5)}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'var(--c-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickCount={6}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--tt-bg)', border: '1px solid var(--tt-border)', color: 'var(--tt-text)', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [<span style={{ color: scoreColor(v), fontWeight: 700 }}>{v}/100</span>, 'Risk Score']}
              labelFormatter={l => `Data: ${l}`}
            />
            <ReferenceLine y={80} stroke="#ef444460" strokeDasharray="4 4" label={{ value: 'CRITICAL', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={60} stroke="#f9731660" strokeDasharray="4 4" label={{ value: 'HIGH', fill: '#f97316', fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="score"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ fill: lineColor, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
