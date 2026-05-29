import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Printer, Copy, Check, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { useReportStore } from '@/store/reportStore'
import { useCounter } from '@/hooks/useCounter'
import { useLang } from '@/hooks/useLang'
import { riskGradient } from '@/utils/colors'

import { BackgroundEffect }        from './BackgroundEffect'
import { SkeletonLoader }          from './SkeletonLoader'
import { NoConnection }            from './NoConnection'
import { ImportData }              from './ImportData'
import { ExecutiveSummary }        from './ExecutiveSummary'
import { ScoreRadarChart }         from './ScoreRadarChart'
import { ScoreBreakdown }          from './ScoreBreakdown'
import { SecurityInfrastructure }  from './SecurityInfrastructure'
import { Recommendations }         from './Recommendations'
import { RiskTrendChart }          from './RiskTrendChart'
import { VulnerabilityChart }      from './VulnerabilityChart'
import { PortChart }               from './PortChart'
import { FilterPanel }             from './FilterPanel'
import { SearchBar }               from './SearchBar'
import { ReportExport }            from './ReportExport'
import { DataLeaksTable }          from './DataLeaksTable'
import { CertificatesTable }       from './CertificatesTable'
import { RiskHeatmap }             from './RiskHeatmap'
import { VulnTable }               from './VulnTable'
import { LanguageSwitcher }        from './LanguageSwitcher'

type Tab = 'overview' | 'analytics' | 'vulnerabilities' | 'leaks' | 'certificates'

const TAB_IDS: Tab[] = ['overview', 'analytics', 'vulnerabilities', 'leaks', 'certificates']

/* ── URL sync helpers ─────────────────────────────────────── */
function getTabFromURL(): Tab {
  const p = new URLSearchParams(window.location.search).get('tab') as Tab | null
  return TAB_IDS.includes(p as Tab) ? (p as Tab) : 'overview'
}
function pushTab(tab: Tab) {
  const url = new URL(window.location.href)
  url.searchParams.set('tab', tab)
  window.history.pushState({}, '', url.toString())
}

/* ── Animated KPI card with copy-to-clipboard ─────────────── */
const KpiCard: React.FC<{
  label: string; target: number; sub: string; accent: string; dot: string; delay: number
}> = ({ label, target, sub, accent, dot, delay }) => {
  const count = useCounter(target, 1200)
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(String(target)).then(() => {
      setCopied(true)
      toast.success(`Copiato: ${target.toLocaleString()}`, { duration: 1800 })
      setTimeout(() => setCopied(false), 2000)
    })
  }, [target])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: `0 12px 40px ${dot}30` }}
      transition={{ delay, duration: 0.4 }}
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      className="rounded-2xl p-6 shadow-lg group relative cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ backgroundColor: dot }} className="w-2 h-2 rounded-full" />
          <p style={{ color: 'var(--c-muted)' }} className="text-xs font-semibold uppercase tracking-wide">{label}</p>
        </div>
        <button
          onClick={copy}
          title="Copia valore"
          style={{ color: 'var(--c-muted)' }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:opacity-60"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <p style={{ color: accent }} className="text-4xl font-black mb-1">{count.toLocaleString()}</p>
      <p style={{ color: 'var(--c-muted)' }} className="text-xs">{sub}</p>
    </motion.div>
  )
}

/* ── Main Dashboard ────────────────────────────────────────── */
export const Dashboard: React.FC = () => {
  const { reports, activeReport, loading, error, fetchReports, fetchReport } = useReportStore()
  const { t } = useLang()

  const TABS = [
    { id: 'overview' as Tab,        label: t.tab_overview },
    { id: 'analytics' as Tab,       label: t.tab_analytics },
    { id: 'vulnerabilities' as Tab, label: t.tab_vulnerabilities },
    { id: 'leaks' as Tab,           label: t.tab_leaks },
    { id: 'certificates' as Tab,    label: t.tab_certificates },
  ]

  /* tab — synced with URL */
  const [tab, setTab] = useState<Tab>(getTabFromURL)
  const handleTab = (id: Tab) => { setTab(id); pushTab(id) }
  const [showImport, setShowImport] = useState(false)

  /* listen browser back/forward */
  useEffect(() => {
    const onPop = () => setTab(getTabFromURL())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* dark mode — persisted in localStorage */
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light')
  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }
  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', !isDark)
  }, [isDark])

  useEffect(() => { fetchReports() }, [fetchReports])
  useEffect(() => {
    if (reports.length > 0) fetchReport(reports[0].idsummary)
  }, [reports, fetchReport])

  if (loading) return <SkeletonLoader />

  if (error) {
    return <NoConnection error={error} onRetry={fetchReports} />
  }

  if (!activeReport) {
    return (
      <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="text-center">
          <img src="/digimetrica-full-inverted-transparent@2x.png" alt="Digimetrica" className="h-10 mx-auto mb-4 opacity-40" />
          <p style={{ color: 'var(--c-muted)' }} className="text-sm">
            {t.status_noReport} {t.status_noReportCmd} <code className="mx-1 text-blue-400">backend/data/</code>
          </p>
        </div>
      </div>
    )
  }

  const r = activeReport
  const riskScore = Number(r.risk_score)
  const riskLabel = riskScore >= 80 ? t.risk_critical : riskScore >= 60 ? t.risk_high : riskScore >= 40 ? t.risk_medium : t.risk_low
  const riskBadge = {
    backgroundColor: riskScore >= 80 ? '#ef444422' : riskScore >= 60 ? '#f9731622' : '#eab30822',
    color: riskScore >= 80 ? '#f87171' : riskScore >= 60 ? '#fb923c' : '#fbbf24',
    border: '1px solid currentColor',
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }} className="relative">
      <BackgroundEffect />

      <AnimatePresence>
        {showImport && <ImportData onClose={() => setShowImport(false)} />}
      </AnimatePresence>

      {/* ── Header ── */}
      <header style={{ backgroundColor: 'var(--bg-header)' }} className="sticky top-0 z-20 shadow-xl no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img src="/digimetrica-full-inverted-transparent@2x.png" alt="Digimetrica" className="h-8" />
            <div style={{ backgroundColor: 'var(--border)' }} className="h-5 w-px" />
            <span style={{ color: 'var(--c-muted)' }} className="hidden md:block text-sm font-medium tracking-wide">
              {t.header_subtitle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar />
            <button
              onClick={() => setShowImport(true)}
              title={t.btn_import}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: '#065f46' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#047857')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#065f46')}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{t.btn_import}</span>
            </button>
            <ReportExport reportId={r.idsummary} />
            <button
              onClick={() => window.print()}
              title={t.btn_print}
              style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-muted)' }}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            >
              <Printer className="w-4 h-4" />
            </button>
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              title={isDark ? 'Light mode' : 'Dark mode'}
              style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-muted)' }}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Animated glow line under header */}
        <div className="header-glow-line no-print" />

        {/* ── Tabs ── */}
        <div style={{ borderTop: '1px solid var(--border)' }} className="max-w-7xl mx-auto px-6">
          <div className="flex">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleTab(id)}
                style={{
                  color: tab === id ? '#60a5fa' : 'var(--c-muted)',
                  borderBottom: tab === id ? '2px solid #60a5fa' : '2px solid transparent',
                }}
                className="px-4 py-3 text-sm font-medium transition-colors hover:opacity-80 whitespace-nowrap"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">

        {/* Meta row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: 'var(--c-text)' }} className="text-xl font-bold">{r.domain_name}</h1>
            <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-0.5">
              {t.meta_report} {r.creation_date} · {t.meta_updated} {r.last_edit}
            </p>
          </div>
          <span style={riskBadge} className="text-xs font-bold px-3 py-1 rounded-full">{riskLabel} RISK</span>
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════ OVERVIEW ══════════ */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Risk Banner */}
              <div className={`shimmer-wrap bg-gradient-to-r ${riskGradient(riskScore)} text-white rounded-2xl p-6 sm:p-8 shadow-2xl`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">{t.risk_score}</p>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl sm:text-8xl font-black leading-none">{riskScore}</span>
                      <span className="text-xl sm:text-2xl font-light opacity-60 mb-2">/ 100</span>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-2xl sm:text-4xl font-black mb-1">{riskLabel}</p>
                    <p className="text-sm opacity-70">{t.risk_action}</p>
                    <div className="mt-3 sm:mt-4 flex gap-2 sm:justify-end items-center text-xs opacity-60">
                      <span>{t.risk_poweredBy}</span>
                      <img src="/digimetrica-full-inverted-transparent@2x.png" alt="Digimetrica" className="h-4" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${riskScore}%` }} transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }} className="h-full bg-white/70 rounded-full" />
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label={t.kpi_vulnerabilities} target={Object.values(r.n_vulns.total).reduce((a, b) => a + b, 0)} sub={`${r.n_vulns.total.critical ?? 0} ${t.risk_critical.toLowerCase()} · ${r.n_vulns.total.high ?? 0} ${t.risk_high.toLowerCase()}`} accent="#ef4444" dot="#ef4444" delay={0} />
                <KpiCard label={t.kpi_leaks}           target={Object.values(r.n_dataleak.total).reduce((a, b) => a + b, 0)} sub={`${Object.values(r.n_dataleak.unresolved).reduce((a, b) => a + b, 0)} ${t.tbl_distribution.toLowerCase()}`} accent="#f97316" dot="#f97316" delay={0.08} />
                <KpiCard label={t.kpi_certificates}    target={r.n_cert_attivi + r.n_cert_scaduti} sub={`${r.n_cert_attivi} ${t.cert_active.toLowerCase()} · ${r.n_cert_scaduti} ${t.cert_expired.toLowerCase()}`} accent="#60a5fa" dot="#60a5fa" delay={0.16} />
                <KpiCard label={t.kpi_assets}          target={r.n_asset} sub={`${r.unique_ipv4} IPv4 · ${r.unique_ipv6} IPv6`} accent="#34d399" dot="#34d399" delay={0.24} />
              </div>

              <ScoreBreakdown report={r} />
              <Recommendations report={r} />
              <ExecutiveSummary text={r.summary_text_en} />
              <SecurityInfrastructure report={r} />
            </motion.div>
          )}

          {/* ══════════ ANALYTICS ══════════ */}
          {tab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <RiskTrendChart reportId={r.idsummary} />
              <ScoreRadarChart report={r} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VulnerabilityChart vulns={r.n_vulns} />
                <PortChart ports={r.n_port} />
              </div>
              <RiskHeatmap vulns={r.n_vulns} />
              {/* Email Security */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl p-6 shadow-lg">
                <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold mb-4">{t.sec_email}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: t.email_spoofing, value: r.email_security.spoofable.includes('possible') ? t.email_vulnerable : t.email_protected, ok: !r.email_security.spoofable.includes('possible') },
                    { title: t.email_dmarc, value: r.email_security.dmarc_policy.toUpperCase(), ok: true },
                    { title: t.email_blacklist, value: r.email_security.blacklist_detections === 0 ? t.email_clean : `⚠ ${r.email_security.blacklist_detections}`, ok: r.email_security.blacklist_detections === 0, sub: `${r.email_security.blacklist_detections} / ${r.email_security.blacklist_total_list}` },
                  ].map(({ title, value, ok, sub }) => (
                    <div key={title} style={{ backgroundColor: ok ? '#22c55e10' : '#ef444415', border: `1px solid ${ok ? '#22c55e30' : '#ef444440'}` }} className="rounded-xl p-4">
                      <p style={{ color: 'var(--c-muted)' }} className="text-xs font-semibold uppercase mb-2">{title}</p>
                      <p style={{ color: ok ? '#4ade80' : '#f87171' }} className="font-bold text-sm">{value}</p>
                      {sub && <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-1">{sub}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════ VULNERABILITIES ══════════ */}
          {tab === 'vulnerabilities' && (
            <motion.div key="vulns" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <FilterPanel />
              <VulnTable vulns={r.n_vulns} />
            </motion.div>
          )}

          {/* ══════════ DATA LEAKS ══════════ */}
          {tab === 'leaks' && (
            <motion.div key="leaks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DataLeaksTable leaks={r.n_dataleak} />
            </motion.div>
          )}

          {/* ══════════ CERTIFICATES ══════════ */}
          {tab === 'certificates' && (
            <motion.div key="certs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              <CertificatesTable active={r.n_cert_attivi} expired={r.n_cert_scaduti} />

              {/* Certificate score */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl p-6 shadow-lg">
                <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold mb-4">{t.sec_certScore}</h3>
                <div className="flex items-center gap-4 mb-2">
                  <span style={{ color: r.certificate_score >= 80 ? '#f87171' : r.certificate_score >= 40 ? '#fbbf24' : '#4ade80' }} className="text-5xl font-black">
                    {r.certificate_score}
                  </span>
                  <div>
                    <p style={{ color: 'var(--c-muted)' }} className="text-sm">{t.cert_score_lbl}</p>
                    <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-0.5">
                      {r.n_cert_scaduti} {t.cert_expired.toLowerCase()} / {r.n_cert_attivi + r.n_cert_scaduti}
                      ({Math.round(r.n_cert_scaduti / (r.n_cert_attivi + r.n_cert_scaduti) * 100)}%)
                    </p>
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card-hi)' }} className="h-3 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${r.certificate_score}%`,
                      backgroundColor: r.certificate_score >= 80 ? '#ef4444' : r.certificate_score >= 40 ? '#eab308' : '#22c55e',
                    }}
                    className="h-full rounded-full transition-all"
                  />
                </div>
              </div>

              {/* Email Security */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl p-6 shadow-lg">
                <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold mb-4">{t.sec_email}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: t.email_spoofing,
                      value: r.email_security.spoofable.includes('possible') ? t.email_vulnerable : t.email_protected,
                      ok: !r.email_security.spoofable.includes('possible'),
                      sub: r.email_security.spoofable,
                    },
                    {
                      title: t.email_dmarc,
                      value: r.email_security.dmarc_policy.toUpperCase(),
                      ok: r.email_security.dmarc_policy === 'reject',
                      sub: r.email_security.dmarc_policy !== 'reject' ? 'DMARC → reject' : '✓',
                    },
                    {
                      title: t.email_blacklist,
                      value: r.email_security.blacklist_detections === 0 ? t.email_clean : `${t.email_flagged}: ${r.email_security.blacklist_detections}`,
                      ok: r.email_security.blacklist_detections === 0,
                      sub: `${r.email_security.blacklist_detections} / ${r.email_security.blacklist_total_list}`,
                    },
                  ].map(({ title, value, ok, sub }) => (
                    <div key={title} style={{ backgroundColor: ok ? '#22c55e10' : '#ef444415', border: `1px solid ${ok ? '#22c55e30' : '#ef444440'}` }} className="rounded-xl p-4">
                      <p style={{ color: 'var(--c-muted)' }} className="text-xs font-semibold uppercase mb-2">{title}</p>
                      <p style={{ color: ok ? '#4ade80' : '#f87171' }} className="font-bold text-sm mb-1">{value}</p>
                      <p style={{ color: 'var(--c-muted)' }} className="text-xs">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--border)' }} className="flex items-center justify-between pt-4 pb-8 mt-10 no-print">
          <img src="/digimetrica-full-inverted-transparent@2x.png" alt="Digimetrica" className="h-6 opacity-50" />
          <p style={{ color: 'var(--c-muted)' }} className="text-xs">
            {t.footer} · {r.domain_name} · {r.creation_date}
          </p>
        </footer>

      </main>
    </div>
  )
}
