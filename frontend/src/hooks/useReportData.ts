import { useEffect } from 'react'
import { useReportStore } from '@/store/reportStore'

export function useReportData(id?: string) {
  const { activeReport, reports, loading, error, fetchReports, fetchReport } = useReportStore()

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  useEffect(() => {
    if (id) fetchReport(id)
  }, [id, fetchReport])

  return { activeReport, reports, loading, error }
}
