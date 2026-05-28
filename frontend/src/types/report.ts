export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type VulnStatus = 'active' | 'passive'

export interface EmailSecurity {
  spoofable: string
  dmarc_policy: string
  blacklist_detections: number
  blacklist_total_list: number
  blacklist_detected_list: string[]
}

export interface DataLeak {
  total: Record<string, number>
  resolved: Record<string, number>
  unresolved: Record<string, number>
}

export interface VulnCounts {
  total: Record<string, number>
  active: Record<string, number>
  passive: Record<string, number>
}

export interface PortData {
  n: number
}

export interface SecurityReport {
  idsummary: string
  summary_text: string
  summary_text_en: string
  risk_score: number | string
  creation_date: string
  last_edit: string
  domain_name: string

  servizi_esposti_score: number
  dataleak_score: number
  rapporto_leak_email_score: number
  spoofing_score: number
  open_ports_score: number
  blacklist_score: number
  vulnerability_score_active: number
  vulnerability_score_passive: number
  certificate_score: number

  n_asset: number
  n_similar_domains: number
  n_cert_attivi: number
  n_cert_scaduti: number
  unique_ipv4: number
  unique_ipv6: number

  n_port: Record<string, PortData>
  n_dataleak: DataLeak
  n_vulns: VulnCounts
  email_security: EmailSecurity
  waf: { count: number; assets: string[] }
  cdn: { count: number; assets: string[] }
}

export interface ReportSummary {
  idsummary: string
  domain_name: string
  risk_score: number
  creation_date: string
  vulnerability_count: number
  dataleak_count: number
  certificate_count: number
}

export interface Vulnerability {
  id: string
  severity: Severity
  status: VulnStatus
  title: string
  description: string
  cve?: string
  port?: number
  discovered_date?: string
}

export interface FilterState {
  searchTerm: string
  selectedSeverity: Severity[]
  selectedStatus: VulnStatus | 'all'
  showResolved: boolean
}

export interface AnalyticsData {
  risk_trend: Array<{ date: string; score: number }>
  severity_distribution: Record<string, number>
  port_exposure: Array<{ port: number; count: number }>
  dataleak_trend: Array<{ date: string; count: number }>
}
