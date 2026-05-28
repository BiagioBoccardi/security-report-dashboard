import { api } from './api'

export function downloadExport(reportId: string, format: 'csv' | 'json'): void {
  const url = api.exportUrl(reportId, format)
  const a = document.createElement('a')
  a.href = url
  a.download = `report_${reportId}.${format}`
  a.click()
}
