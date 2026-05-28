import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

const card = '#162548'
const border = 'rgba(255,255,255,0.08)'
const text = '#f0f4ff'

interface Props { active: number; expired: number }

export const CertificatesTable: React.FC<Props> = ({ active, expired }) => (
  <div style={{ backgroundColor: card, border: `1px solid ${border}` }} className="rounded-2xl p-6 shadow-lg">
    <h3 style={{ color: text }} className="text-base font-semibold mb-4">Certificati SSL/TLS</h3>
    <div className="grid grid-cols-2 gap-4">
      <div style={{ backgroundColor: '#22c55e10', border: '1px solid #22c55e30' }} className="rounded-xl p-5 flex items-center gap-4">
        <CheckCircle className="w-8 h-8 flex-shrink-0" style={{ color: '#4ade80' }} />
        <div>
          <p style={{ color: '#4ade80' }} className="text-3xl font-black">{active}</p>
          <p style={{ color: '#4ade8099' }} className="text-sm mt-0.5">Attivi</p>
        </div>
      </div>
      <div style={{ backgroundColor: '#ef444410', border: '1px solid #ef444430' }} className="rounded-xl p-5 flex items-center gap-4">
        <XCircle className="w-8 h-8 flex-shrink-0" style={{ color: '#f87171' }} />
        <div>
          <p style={{ color: '#f87171' }} className="text-3xl font-black">{expired}</p>
          <p style={{ color: '#f8717199' }} className="text-sm mt-0.5">Scaduti</p>
        </div>
      </div>
    </div>
  </div>
)
