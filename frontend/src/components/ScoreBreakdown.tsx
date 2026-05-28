import React from 'react'
import { motion } from 'framer-motion'
import type { SecurityReport } from '@/types/report'
import { useLang } from '@/hooks/useLang'

interface Props { report: SecurityReport }

function barColor(v: number): string {
  if (v >= 80) return '#ef4444'
  if (v >= 60) return '#f97316'
  if (v >= 40) return '#eab308'
  return '#22c55e'
}

export const ScoreBreakdown: React.FC<Props> = ({ report: r }) => {
  const { t } = useLang()

  const data = [
    { label: t.lbl_serviziEsposti, value: r.servizi_esposti_score },
    { label: t.lbl_dataLeak,       value: r.dataleak_score },
    { label: t.lbl_vulnPassive,    value: r.vulnerability_score_passive },
    { label: t.lbl_vulnActive,     value: r.vulnerability_score_active },
    { label: t.lbl_blacklist,      value: r.blacklist_score },
    { label: t.lbl_certScore,      value: r.certificate_score },
    { label: t.lbl_spoofing,       value: r.spoofing_score },
    { label: t.lbl_emailLeak,      value: r.rapporto_leak_email_score },
    { label: t.lbl_openPorts,      value: r.open_ports_score },
  ].sort((a, b) => b.value - a.value)

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      className="rounded-2xl p-6 shadow-lg"
    >
      <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold mb-1">{t.sec_score}</h3>
      <p style={{ color: 'var(--c-muted)' }} className="text-xs mb-5">{t.sec_score_sub}</p>

      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: 'var(--c-muted)' }} className="text-xs font-medium">{item.label}</span>
              <span style={{ color: barColor(item.value) }} className="text-xs font-black">{item.value}</span>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card-hi)' }} className="h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ delay: i * 0.06, duration: 0.8, ease: 'easeOut' }}
                style={{ backgroundColor: barColor(item.value) }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
