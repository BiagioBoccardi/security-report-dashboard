import React from 'react'
import type { VulnCounts } from '@/types/report'
import { SEVERITY_COLORS } from '@/utils/colors'
import { SEVERITIES } from '@/utils/constants'

interface Props { vulns: VulnCounts }

export const RiskHeatmap: React.FC<Props> = ({ vulns }) => {
  const buckets = ['total', 'active', 'passive'] as const
  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl p-6 shadow-lg">
      <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold mb-4">Risk Heatmap</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th style={{ color: 'var(--c-muted)' }} className="text-left pb-3 font-medium w-20">Status</th>
              {SEVERITIES.map(s => <th key={s} style={{ color: SEVERITY_COLORS[s] }} className="pb-3 text-center font-semibold capitalize">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {buckets.map(bucket => (
              <tr key={bucket}>
                <td style={{ color: 'var(--c-muted)' }} className="py-2 capitalize font-medium text-xs">{bucket}</td>
                {SEVERITIES.map(s => {
                  const count = vulns[bucket][s] ?? 0
                  const intensity = Math.min(count / 10, 1)
                  return (
                    <td key={s} className="py-2 text-center">
                      <div className="mx-auto w-14 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: SEVERITY_COLORS[s], opacity: count === 0 ? 0.08 : 0.15 + intensity * 0.85 }}>
                        {count}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
