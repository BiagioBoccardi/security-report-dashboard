import React from 'react'
import { Search } from 'lucide-react'
import { useFilterStore } from '@/store/filterStore'
import { SEVERITIES } from '@/utils/constants'
import { SEVERITY_COLORS } from '@/utils/colors'
import type { Severity, VulnStatus } from '@/types/report'

const card = '#162548'
const border = 'rgba(255,255,255,0.08)'
const muted = '#7a90b8'
const chip = '#1c2f5a'

export const FilterPanel: React.FC = () => {
  const { selectedSeverity, selectedStatus, searchTerm, setSeverity, setStatus, setSearch, clearFilters } = useFilterStore()

  const toggleSeverity = (s: Severity) => {
    if (selectedSeverity.includes(s)) setSeverity(selectedSeverity.filter((x) => x !== s))
    else setSeverity([...selectedSeverity, s])
  }

  return (
    <div style={{ backgroundColor: card, border: `1px solid ${border}` }} className="rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg flex flex-wrap items-center gap-2 sm:gap-3">

      <span style={{ color: muted }} className="text-xs font-semibold uppercase tracking-wide">Severity:</span>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            onClick={() => toggleSeverity(s)}
            style={{
              backgroundColor: selectedSeverity.includes(s) ? SEVERITY_COLORS[s] + '33' : chip,
              border: `1px solid ${selectedSeverity.includes(s) ? SEVERITY_COLORS[s] : 'transparent'}`,
              color: selectedSeverity.includes(s) ? SEVERITY_COLORS[s] : muted,
            }}
            className="px-2.5 py-1 rounded-full text-xs font-medium transition-all capitalize min-h-[32px]"
          >
            {s}
          </button>
        ))}
      </div>

      <span style={{ color: muted }} className="text-xs font-semibold uppercase tracking-wide">Status:</span>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {(['all', 'active', 'passive'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatus(st as VulnStatus | 'all')}
            style={{
              backgroundColor: selectedStatus === st ? '#60a5fa22' : chip,
              border: `1px solid ${selectedStatus === st ? '#60a5fa' : 'transparent'}`,
              color: selectedStatus === st ? '#60a5fa' : muted,
            }}
            className="px-2.5 py-1 rounded-full text-xs font-medium transition-all capitalize min-h-[32px]"
          >
            {st}
          </button>
        ))}
      </div>

      {/* Search inline */}
      <div className="relative ml-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: muted }} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca severity..."
          style={{
            backgroundColor: chip,
            border: `1px solid ${border}`,
            color: '#f0f4ff',
          }}
          className="pl-8 pr-3 py-1.5 w-36 sm:w-44 text-xs rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-[#7a90b8]"
        />
      </div>

      {(selectedSeverity.length > 0 || selectedStatus !== 'all' || searchTerm) && (
        <button
          onClick={clearFilters}
          style={{ color: muted }}
          className="text-xs hover:text-white underline transition-colors py-1"
        >
          Reset
        </button>
      )}
    </div>
  )
}
