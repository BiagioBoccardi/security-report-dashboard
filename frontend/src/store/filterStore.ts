import { create } from 'zustand'
import type { FilterState, Severity, VulnStatus } from '@/types/report'

interface FilterStore extends FilterState {
  setSearch: (term: string) => void
  setSeverity: (severities: Severity[]) => void
  setStatus: (status: VulnStatus | 'all') => void
  setShowResolved: (show: boolean) => void
  clearFilters: () => void
}

const initial: FilterState = {
  searchTerm: '',
  selectedSeverity: [],
  selectedStatus: 'all',
  showResolved: false,
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...initial,
  setSearch: (term) => set({ searchTerm: term }),
  setSeverity: (severities) => set({ selectedSeverity: severities }),
  setStatus: (status) => set({ selectedStatus: status }),
  setShowResolved: (show) => set({ showResolved: show }),
  clearFilters: () => set(initial),
}))
