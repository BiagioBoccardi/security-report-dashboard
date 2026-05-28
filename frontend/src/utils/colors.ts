import type { Severity } from '@/types/report'

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#9ca3af',
}

export const SEVERITY_BG: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  info: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export function riskColor(score: number): string {
  if (score >= 80) return 'text-red-600'
  if (score >= 60) return 'text-orange-500'
  if (score >= 40) return 'text-yellow-500'
  return 'text-green-500'
}

export function riskGradient(score: number): string {
  if (score >= 80) return 'from-red-500 to-red-700'
  if (score >= 60) return 'from-orange-500 to-orange-700'
  if (score >= 40) return 'from-yellow-500 to-yellow-600'
  return 'from-green-500 to-green-600'
}
