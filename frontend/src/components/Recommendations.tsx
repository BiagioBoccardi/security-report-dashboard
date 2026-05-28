import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, AlertTriangle, Info } from 'lucide-react'
import type { SecurityReport } from '@/types/report'

interface Rec {
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  action: string
}

function generate(r: SecurityReport): Rec[] {
  const recs: Rec[] = []

  if ((r.n_vulns.active.critical ?? 0) > 0)
    recs.push({ priority: 'critical', title: `Risolvere ${r.n_vulns.active.critical} vulnerabilità critiche attive`, description: 'Rappresentano il rischio più immediato. Richiedono patch o mitigazione urgente.', action: 'Patch immediata' })

  const unresolved = Object.values(r.n_dataleak.unresolved).reduce((a, b) => a + b, 0)
  if (unresolved > 0)
    recs.push({ priority: unresolved > 100 ? 'critical' : 'high', title: `Investigare ${unresolved} data leak irrisolti`, description: 'Credenziali o dati potenzialmente esposti non ancora mitigati.', action: 'Analisi + reset credenziali' })

  if (r.email_security.spoofable.includes('possible'))
    recs.push({ priority: 'high', title: 'Rafforzare DMARC/SPF/DKIM', description: 'Il dominio è vulnerabile allo spoofing email. La policy "quarantine" non è sufficiente.', action: 'Impostare DMARC policy su "reject"' })

  if (r.n_cert_scaduti > 0)
    recs.push({ priority: r.n_cert_scaduti > 5 ? 'high' : 'medium', title: `Rinnovare ${r.n_cert_scaduti} certificati SSL/TLS scaduti`, description: 'I certificati scaduti espongono le comunicazioni a rischi di intercettazione e warning browser.', action: 'Rinnovo urgente certificati' })

  if ((r.n_vulns.passive.high ?? 0) > 5)
    recs.push({ priority: 'high', title: `Analizzare ${r.n_vulns.passive.high} vulnerabilità passive alte`, description: 'Le vulnerabilità passive possono diventare vettori di attacco attivi se non gestite.', action: 'Security audit passivo' })

  if (r.cdn.count === 0)
    recs.push({ priority: 'medium', title: 'Implementare un CDN', description: 'Nessun CDN rilevato. Il traffico diretto agli asset aumenta la superficie esposta ad attacchi DDoS.', action: 'Valutare Cloudflare o Fastly' })

  if (r.n_similar_domains > 5)
    recs.push({ priority: 'medium', title: `Monitorare ${r.n_similar_domains} domini simili`, description: 'Elevato rischio di typosquatting e phishing tramite varianti del dominio principale.', action: 'Registrare varianti critiche' })

  if (r.waf.count < r.n_asset / 10)
    recs.push({ priority: 'medium', title: `Estendere WAF a più asset`, description: `Solo ${r.waf.count} asset su ${r.n_asset} risultano protetti da WAF.`, action: 'Estendere copertura WAF' })

  recs.push({ priority: 'low', title: 'Pianificare vulnerability assessment periodico', description: 'Con 162 vulnerabilità totali, è consigliato un ciclo di revisione trimestrale.', action: 'Schedulare prossimo assessment' })

  const order = { critical: 0, high: 1, medium: 2, low: 3 }
  return recs.sort((a, b) => order[a.priority] - order[b.priority])
}

const PRIORITY_STYLE: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  critical: { bg: '#ef444412', border: '#ef444440', text: '#f87171', icon: <AlertTriangle className="w-4 h-4" /> },
  high:     { bg: '#f9731612', border: '#f9731640', text: '#fb923c', icon: <AlertTriangle className="w-4 h-4" /> },
  medium:   { bg: '#eab30812', border: '#eab30840', text: '#fbbf24', icon: <Info className="w-4 h-4" /> },
  low:      { bg: '#22c55e12', border: '#22c55e40', text: '#4ade80', icon: <Info className="w-4 h-4" /> },
}

interface Props { report: SecurityReport }

export const Recommendations: React.FC<Props> = ({ report }) => {
  const [expanded, setExpanded] = useState(true)
  const recs = generate(report)
  const criticalCount = recs.filter(r => r.priority === 'critical').length

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-6 py-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5" style={{ color: '#fbbf24' }} />
          <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold">Azioni Consigliate</h3>
          {criticalCount > 0 && (
            <span style={{ backgroundColor: '#ef444422', color: '#f87171', border: '1px solid #ef444440' }} className="text-xs px-2 py-0.5 rounded-full font-bold">
              {criticalCount} CRITICHE
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--c-muted)' }} />
          : <ChevronDown className="w-4 h-4" style={{ color: 'var(--c-muted)' }} />}
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }} className="p-6 space-y-3">
          {recs.map((rec, i) => {
            const s = PRIORITY_STYLE[rec.priority]
            return (
              <div key={i} style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }} className="rounded-xl p-4 flex gap-4">
                <div style={{ color: s.text }} className="flex-shrink-0 mt-0.5">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <p style={{ color: 'var(--c-text)' }} className="font-semibold text-sm">{rec.title}</p>
                    <span style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }} className="text-xs px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0">
                      {rec.priority}
                    </span>
                  </div>
                  <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-1 leading-relaxed">{rec.description}</p>
                  <p style={{ color: s.text }} className="text-xs mt-2 font-semibold">→ {rec.action}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
