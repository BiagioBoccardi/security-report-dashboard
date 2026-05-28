import React from 'react'
import { useFilterStore } from '@/store/filterStore'
import { SEVERITIES } from '@/utils/constants'
import { SEVERITY_COLORS } from '@/utils/colors'
import type { Severity, VulnStatus } from '@/types/report'

const card = '#162548'
const border = 'rgba(255,255,255,0.08)'
const muted = '#7a90b8'
const chip = '#1c2f5a'

export const FilterPanel: React.FC = () => {
  const { selectedSeverity, selectedStatus, setSeverity, setStatus, clearFilters } = useFilterStore()

  const toggleSeverity = (s: Severity) => {
    if (selectedSeverity.includes(s)) setSeverity(selectedSeverity.filter((x) => x !== s))
    else setSeverity([...selectedSeverity, s])
  }

  return (
    <div style={{ backgroundColor: card, border: `1px solid ${border}` }} className="rounded-2xl px-5 py-4 shadow-lg flex flex-wrap items-center gap-4">
      <span style={{ color: muted }} className="text-xs font-semibold uppercase tracking-wide">Severity:</span>
      <div className="flex gap-2">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            onClick={() => toggleSeverity(s)}
            style={{
              backgroundColor: selectedSeverity.includes(s) ? SEVERITY_COLORS[s] + '33' : chip,
              border: `1px solid ${selectedSeverity.includes(s) ? SEVERITY_COLORS[s] : 'transparent'}`,
              color: selectedSeverity.includes(s) ? SEVERITY_COLORS[s] : muted,
            }}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all capitalize"
          >
            {s}
          </button>
        ))}
      </div>

      <span style={{ color: muted }} className="text-xs font-semibold uppercase tracking-wide ml-2">Status:</span>
      <div className="flex gap-2">
        {(['all', 'active', 'passive'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatus(st as VulnStatus | 'all')}
            style={{
              backgroundColor: selectedStatus === st ? '#60a5fa22' : chip,
              border: `1px solid ${selectedStatus === st ? '#60a5fa' : 'transparent'}`,
              color: selectedStatus === st ? '#60a5fa' : muted,
            }}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all capitalize"
          >
            {st}
          </button>
        ))}
      </div>

      {(selectedSeverity.length > 0 || selectedStatus !== 'all') && (
        <button onClick={clearFilters} style={{ color: muted }} className="ml-auto text-xs hover:text-white underline transition-colors">
          Reset
        </button>
      )}
    </div>
  )
}
