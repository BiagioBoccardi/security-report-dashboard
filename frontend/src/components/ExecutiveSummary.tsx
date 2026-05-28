import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

interface Props {
  text: string
  lang?: 'it' | 'en'
}

function parseSections(text: string): Array<{ title: string; body: string }> {
  const sections: Array<{ title: string; body: string }> = []
  const parts = text.split(/\n\n(?=\*\*)/)

  for (const part of parts) {
    const match = part.match(/^\*\*(.+?)\*\*\n([\s\S]*)/)
    if (match) {
      sections.push({ title: match[1].replace(/:$/, '').trim(), body: match[2].trim() })
    } else if (sections.length === 0 && part.trim()) {
      sections.push({ title: 'Overview', body: part.replace(/\*\*.*?\*\*/g, '').trim() })
    }
  }
  return sections
}

const ICONS: Record<string, string> = {
  'Overview': '📋',
  'Vulnerability': '🛡',
  'Exposure': '🌐',
  'Services': '🌐',
  'Data Leakage': '💧',
  'Certificates': '🔐',
  'Technology': '🔐',
  'Email Security': '📧',
}

function getIcon(title: string): string {
  for (const [key, icon] of Object.entries(ICONS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '📌'
}

export const ExecutiveSummary: React.FC<Props> = ({ text }) => {
  const [expanded, setExpanded] = useState(true)
  const sections = parseSections(text)

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      className="rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-6 py-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" style={{ color: '#60a5fa' }} />
          <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold">Executive Summary</h3>
          <span
            style={{ backgroundColor: '#60a5fa22', color: '#60a5fa', border: '1px solid #60a5fa44' }}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
          >
            EN
          </span>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--c-muted)' }} />
          : <ChevronDown className="w-4 h-4" style={{ color: 'var(--c-muted)' }} />
        }
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s, i) => (
            <div
              key={i}
              style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)' }}
              className="rounded-xl p-4"
            >
              <p style={{ color: 'var(--c-text)' }} className="font-semibold text-sm mb-2">
                {getIcon(s.title)} {s.title}
              </p>
              <p style={{ color: 'var(--c-muted)' }} className="text-xs leading-relaxed">
                {s.body.replace(/^- /, '').split('\n- ').join(' • ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
