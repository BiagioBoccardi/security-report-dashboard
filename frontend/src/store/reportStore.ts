import { create } from 'zustand'
import type { ReportSummary, SecurityReport } from '@/types/report'
import { api } from '@/services/api'

interface ReportStore {
  reports: ReportSummary[]
  activeReport: SecurityReport | null
  loading: boolean
  error: string | null

  fetchReports: () => Promise<void>
  fetchReport: (id: string) => Promise<void>
  reinitialize: () => Promise<void>
  clearError: () => void
}

export const useReportStore = create<ReportStore>((set) => ({
  reports: [],
  activeReport: null,
  loading: false,
  error: null,

  fetchReports: async () => {
    set({ loading: true, error: null })
    try {
      const reports = await api.listReports()
      set({ reports, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  fetchReport: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const report = await api.getReport(id)
      set({ activeReport: report, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  // Atomically resets everything and re-fetches from scratch.
  // Used after import to avoid race conditions with Dashboard's useEffects.
  reinitialize: async () => {
    set({ reports: [], activeReport: null, loading: true, error: null })
    try {
      const reports = await api.listReports()
      if (reports.length > 0) {
        const report = await api.getReport(reports[0].idsummary)
        set({ reports, activeReport: report, loading: false })
      } else {
        set({ reports, loading: false })
      }
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
