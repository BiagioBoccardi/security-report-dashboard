import React from 'react'
import type { DataLeak } from '@/types/report'

const card = '#162548'
const border = 'rgba(255,255,255,0.08)'
const text = '#f0f4ff'
const muted = '#7a90b8'
const inner = '#1c2f5a'

const CATEGORIES = [
  { key: 'domain_stealer', label: 'Domain Stealer', accent: '#ef4444' },
  { key: 'potential_stealer', label: 'Potential Stealer', accent: '#f97316' },
  { key: 'other_stealer', label: 'Other Stealer', accent: '#eab308' },
]

interface Props { leaks: DataLeak }

export const DataLeaksTable: React.FC<Props> = ({ leaks }) => (
  <div style={{ backgroundColor: card, border: `1px solid ${border}` }} className="rounded-2xl p-6 shadow-lg">
    <h3 style={{ color: text }} className="text-base font-semibold mb-4">Data Leaks</h3>
    <div className="space-y-3">
      {CATEGORIES.map(({ key, label, accent }) => (
        <div key={key} style={{ backgroundColor: inner, border: `1px solid ${border}` }} className="rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ backgroundColor: accent }} className="w-2 h-2 rounded-full" />
            <p style={{ color: accent }} className="font-semibold text-sm">{label}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { l: 'Totale', v: leaks.total[key] ?? 0, c: text },
              { l: 'Risolti', v: leaks.resolved[key] ?? 0, c: '#4ade80' },
              { l: 'Irrisolti', v: leaks.unresolved[key] ?? 0, c: '#f87171' },
            ].map(({ l, v, c }) => (
              <div key={l} className="text-center">
                <p style={{ color: c }} className="text-xl font-black">{v}</p>
                <p style={{ color: muted }} className="mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)
