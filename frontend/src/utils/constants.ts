// Empty string = use relative URLs → Vite proxy handles routing (works in Docker).
// Full URL = direct API calls (local dev without Docker).
export const API_URL = import.meta.env.VITE_API_URL || ''

export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'] as const

export const MONITORED_PORTS = [80, 443, 8800, 53, 6697, 6667, 8080]

export const RISK_LABELS: Record<string, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
}
