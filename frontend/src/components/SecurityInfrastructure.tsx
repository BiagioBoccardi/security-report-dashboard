import React from 'react'
import { Shield, Globe, AlertTriangle } from 'lucide-react'
import type { SecurityReport } from '@/types/report'

interface Props { report: SecurityReport }

export const SecurityInfrastructure: React.FC<Props> = ({ report: r }) => {
  const items = [
    {
      icon: Shield,
      label: 'WAF (Web Application Firewall)',
      value: r.waf.count > 0 ? `Attivo su ${r.waf.count} asset` : 'Non rilevato',
      status: r.waf.count > 0 ? 'ok' : 'warn',
      detail: r.waf.count > 0 ? `${r.waf.count} asset protetti` : 'Nessun WAF rilevato — rischio DDoS aumentato',
    },
    {
      icon: Globe,
      label: 'CDN (Content Delivery Network)',
      value: r.cdn.count > 0 ? `Attivo su ${r.cdn.count} asset` : 'Non rilevato',
      status: r.cdn.count > 0 ? 'ok' : 'warn',
      detail: r.cdn.count > 0 ? `${r.cdn.count} asset su CDN` : 'Nessun CDN — esposizione aumentata ad attacchi DDoS',
    },
    {
      icon: AlertTriangle,
      label: 'Domini Simili Rilevati',
      value: `${r.n_similar_domains} domini`,
      status: r.n_similar_domains > 5 ? 'crit' : r.n_similar_domains > 0 ? 'warn' : 'ok',
      detail: r.n_similar_domains > 0 ? `Rischio typosquatting / phishing su ${r.n_similar_domains} varianti` : 'Nessun dominio simile rilevato',
    },
  ]

  const statusColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    ok:   { bg: '#22c55e10', border: '#22c55e30', text: '#4ade80', dot: '#22c55e' },
    warn: { bg: '#f9731610', border: '#f9731630', text: '#fb923c', dot: '#f97316' },
    crit: { bg: '#ef444410', border: '#ef444430', text: '#f87171', dot: '#ef4444' },
  }

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      className="rounded-2xl p-6 shadow-lg"
    >
      <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold mb-4">Security Infrastructure</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, label, value, status, detail }) => {
          const c = statusColors[status]
          return (
            <div
              key={label}
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
              className="rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" style={{ color: c.text }} />
                <span style={{ color: 'var(--c-muted)' }} className="text-xs font-semibold uppercase tracking-wide">
                  {label.split(' ')[0]}
                </span>
              </div>
              <p style={{ color: c.text }} className="text-lg font-black mb-1">{value}</p>
              <p style={{ color: 'var(--c-muted)' }} className="text-xs leading-relaxed">{detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
