import { api } from './api'
import type { ReportSummary, SecurityReport } from '@/types/report'

export async function fetchReports(): Promise<ReportSummary[]> {
  return api.listReports()
}

export async function fetchReport(id: string): Promise<SecurityReport> {
  return api.getReport(id)
}

export function riskLabel(score: number): string {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}
