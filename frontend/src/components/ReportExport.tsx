import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { downloadExport } from '@/services/exportService'

const border = 'rgba(255,255,255,0.08)'

interface Props { reportId: string }

export const ReportExport: React.FC<Props> = ({ reportId }) => {
  const [open, setOpen] = useState(false)

  const handle = (format: 'csv' | 'json') => {
    downloadExport(reportId, format)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white"
        style={{ backgroundColor: '#1d4ed8' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {open && (
        <div style={{ backgroundColor: '#0a1628', border: `1px solid ${border}` }} className="absolute right-0 mt-2 w-32 rounded-xl shadow-2xl z-10 overflow-hidden">
          {(['csv', 'json'] as const).map((f) => (
            <button
              key={f}
              onClick={() => handle(f)}
              style={{ color: '#7a90b8' }}
              className="w-full px-4 py-2.5 text-left text-sm uppercase hover:bg-white/5 transition-colors font-medium"
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
