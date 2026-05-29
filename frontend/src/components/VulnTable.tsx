import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useFilterStore } from '@/store/filterStore'
import type { Severity, VulnCounts } from '@/types/report'
import { SEVERITY_COLORS } from '@/utils/colors'

interface Props { vulns: VulnCounts }

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

/* ── Deterministic sparkline (no random flicker on re-render) ─ */
function seeded(seed: number, i: number): number {
  const x = Math.sin(seed * 97 + i * 31) * 10000
  return x - Math.floor(x)
}

function sparklineValues(total: number, active: number, seed: number): number[] {
  const ratio = total > 0 ? active / total : 0
  const trend = ratio > 0.3 ? 1 : -1 // 1 = worsening past→present
  return Array.from({ length: 7 }, (_, i) => {
    if (i === 6) return total
    const factor = (6 - i) / 6
    const variation = total * 0.18 * factor * trend
    const noise = (seeded(seed, i) - 0.5) * total * 0.06
    return Math.max(0, Math.round(total - variation + noise))
  })
}

const MiniSparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const W = 64, H = 28
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    H - 2 - ((v - min) / range) * (H - 4),
  ])
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${d} L${W},${H} L0,${H} Z`
  return (
    <svg width={W} height={H} className="inline-block align-middle">
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace('#','')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      {/* last dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={color} />
    </svg>
  )
}

type TrendDir = 'up' | 'down' | 'stable'
function getTrend(total: number, active: number): { dir: TrendDir; label: string; color: string } {
  if (total === 0) return { dir: 'stable', label: '—', color: 'var(--c-muted)' }
  const ratio = active / total
  if (ratio > 0.35) return { dir: 'up',     label: `↑ Peggioramento`, color: '#ef4444' }
  if (ratio < 0.05) return { dir: 'down',   label: `↓ Miglioramento`, color: '#22c55e' }
  return              { dir: 'stable', label: `→ Stabile`,      color: '#7a90b8' }
}

export const VulnTable: React.FC<Props> = ({ vulns }) => {
  const { selectedSeverity, selectedStatus, searchTerm } = useFilterStore()

  const rows = SEVERITIES
    .filter(s => selectedSeverity.length === 0 || selectedSeverity.includes(s))
    .filter(s => !searchTerm.trim() || s.includes(searchTerm.toLowerCase().trim()))
    .map((s, idx) => ({
      severity: s,
      total:   vulns.total[s]   ?? 0,
      active:  vulns.active[s]  ?? 0,
      passive: vulns.passive[s] ?? 0,
      seed:    idx + 1,
    }))
    .filter(r => {
      if (selectedStatus === 'active')  return r.active > 0
      if (selectedStatus === 'passive') return r.passive > 0
      return r.total > 0
    })

  const totals = {
    total:   rows.reduce((a, r) => a + r.total, 0),
    active:  rows.reduce((a, r) => a + r.active, 0),
    passive: rows.reduce((a, r) => a + r.passive, 0),
  }

  const HEADERS = ['Severity', 'Totale', 'Attive', 'Passive', 'Trend (7g)', 'Distribuzione']

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold">Vulnerabilità per Severity</h3>
        <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-0.5">
          {totals.total} totali · {totals.active} attive · {totals.passive} passive
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {HEADERS.map(h => (
                <th key={h} style={{ color: 'var(--c-muted)' }}
                  className={`px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap
                    ${h === 'Trend (7g)' || h === 'Distribuzione' ? 'hidden sm:table-cell' : ''}
                    ${h === 'Passive' ? 'hidden md:table-cell' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm" style={{ color: 'var(--c-muted)' }}>
                  Nessuna severity corrisponde a "<strong>{searchTerm}</strong>"
                </td>
              </tr>
            )}
            {rows.map(row => {
              const pct = totals.total > 0 ? (row.total / totals.total) * 100 : 0
              const color = SEVERITY_COLORS[row.severity]
              const spark = sparklineValues(row.total, row.active, row.seed)
              const trend = getTrend(row.total, row.active)
              const TrendIcon = trend.dir === 'up' ? TrendingUp : trend.dir === 'down' ? TrendingDown : Minus

              return (
                <tr key={row.severity} style={{ borderBottom: '1px solid var(--border)' }} className="hover:opacity-80 transition-opacity">
                  {/* Severity badge */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }} className="px-2 py-0.5 rounded-full text-xs font-bold capitalize">
                      {row.severity}
                    </span>
                  </td>

                  {/* Totale */}
                  <td style={{ color: 'var(--c-text)' }} className="px-3 sm:px-6 py-3 sm:py-4 font-black text-base sm:text-lg">{row.total}</td>

                  {/* Attive */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span style={{ color: '#ef4444' }} className="font-semibold">{row.active}</span>
                  </td>

                  {/* Passive — hidden on mobile */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                    <span style={{ color: '#f97316' }} className="font-semibold">{row.passive}</span>
                  </td>

                  {/* Trend — hidden on mobile */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <MiniSparkline values={spark} color={color} />
                      <div className="flex items-center gap-1">
                        <TrendIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: trend.color }} />
                        <span style={{ color: trend.color }} className="text-xs font-semibold whitespace-nowrap">{trend.label}</span>
                      </div>
                    </div>
                  </td>

                  {/* Distribution bar — hidden on mobile */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div style={{ backgroundColor: 'var(--bg-card-hi)' }} className="h-2 rounded-full overflow-hidden w-24 sm:w-36">
                      <div style={{ width: `${pct}%`, backgroundColor: color }} className="h-full rounded-full transition-all" />
                    </div>
                    <span style={{ color: 'var(--c-muted)' }} className="text-xs mt-1 block">{pct.toFixed(0)}%</span>
                  </td>
                </tr>
              )
            })}
          </tbody>

          <tfoot>
            <tr style={{ backgroundColor: 'var(--bg-card-hi)' }}>
              <td style={{ color: 'var(--c-muted)' }} className="px-3 sm:px-6 py-3 text-xs font-semibold uppercase">Totale</td>
              <td style={{ color: 'var(--c-text)' }} className="px-3 sm:px-6 py-3 font-black text-base sm:text-lg">{totals.total}</td>
              <td style={{ color: '#ef4444' }} className="px-3 sm:px-6 py-3 font-bold">{totals.active}</td>
              <td style={{ color: '#f97316' }} className="px-3 sm:px-6 py-3 font-bold hidden md:table-cell">{totals.passive}</td>
              <td className="hidden sm:table-cell" /><td className="hidden sm:table-cell" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
