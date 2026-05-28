import React from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { SecurityReport } from '@/types/report'

interface Props {
  report: SecurityReport
}

function scoreColor(v: number): string {
  if (v >= 80) return '#ef4444'
  if (v >= 60) return '#f97316'
  if (v >= 40) return '#eab308'
  return '#22c55e'
}

export const ScoreRadarChart: React.FC<Props> = ({ report: r }) => {
  const data = [
    { subject: 'Servizi Esposti', value: r.servizi_esposti_score },
    { subject: 'Data Leak',       value: r.dataleak_score },
    { subject: 'Email Leak',      value: r.rapporto_leak_email_score },
    { subject: 'Spoofing',        value: r.spoofing_score },
    { subject: 'Open Ports',      value: r.open_ports_score },
    { subject: 'Blacklist',       value: r.blacklist_score },
    { subject: 'Vuln. Attiva',    value: r.vulnerability_score_active },
    { subject: 'Vuln. Passiva',   value: r.vulnerability_score_passive },
    { subject: 'Certificati',     value: r.certificate_score },
  ]

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      className="rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold">Score Breakdown — Radar</h3>
          <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-0.5">Punteggio 0–100 per area di rischio (più alto = più critico)</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="var(--c-grid)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'var(--c-muted)', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'var(--c-muted)', fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Risk Score"
            dataKey="value"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tt-bg)',
              border: '1px solid var(--tt-border)',
              color: 'var(--tt-text)',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [
              <span style={{ color: scoreColor(value), fontWeight: 700 }}>{value}/100</span>,
              'Score',
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Score legend row */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {data.map((d) => (
          <div
            key={d.subject}
            style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)' }}
            className="rounded-lg px-3 py-2 flex items-center justify-between"
          >
            <span style={{ color: 'var(--c-muted)' }} className="text-xs truncate mr-2">{d.subject}</span>
            <span style={{ color: scoreColor(d.value) }} className="text-sm font-black flex-shrink-0">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
