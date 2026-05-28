import axios from 'axios'
import type { AnalyticsData, ReportSummary, SecurityReport, Vulnerability } from '@/types/report'
import { API_URL } from '@/utils/constants'

const client = axios.create({ baseURL: API_URL })

export const api = {
  health: () => client.get<{ status: string }>('/health').then(r => r.data),

  listReports: () =>
    client.get<{ status: string; reports: ReportSummary[] }>('/api/v1/reports').then(r => r.data.reports),

  getReport: (id: string) =>
    client.get<{ status: string; data: SecurityReport }>(`/api/v1/reports/${id}`).then(r => r.data.data),

  getVulnerabilities: (id: string, params?: { severity?: string; status?: string; limit?: number; offset?: number }) =>
    client
      .get<{ status: string; count: number; vulnerabilities: Vulnerability[] }>(
        `/api/v1/reports/${id}/vulnerabilities`,
        { params },
      )
      .then(r => r.data),

  getAnalytics: (id: string) =>
    client.get<{ status: string; analytics: AnalyticsData }>(`/api/v1/reports/${id}/analytics`).then(r => r.data.analytics),

  exportUrl: (id: string, format: 'csv' | 'json') => `${API_URL}/api/v1/reports/${id}/export?format=${format}`,

  uploadReport: async (file: File): Promise<{ domain: string; idsummary: string; risk_score: string }> => {
    const form = new FormData()
    form.append('file', file)
    const response = await client.post<{ status: string; domain: string; idsummary: string; risk_score: string }>(
      '/api/v1/reports/upload',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data
  },
}
