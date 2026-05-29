import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

interface Props {
  textIt: string
  textEn: string
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
  'Vulnerabilit': '🛡',
  'Exposure': '🌐',
  'Esposizione': '🌐',
  'Services': '🌐',
  'Servizi': '🌐',
  'Data Leakage': '💧',
  'Fuga': '💧',
  'Certificates': '🔐',
  'Certificat': '🔐',
  'Technology': '🔧',
  'Email Security': '📧',
  'Email': '📧',
}

function getIcon(title: string): string {
  for (const [key, icon] of Object.entries(ICONS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '📌'
}

export const ExecutiveSummary: React.FC<Props> = ({ textIt, textEn }) => {
  const [expanded, setExpanded] = useState(true)
  const [lang, setLang] = useState<'it' | 'en'>('en')

  const sections = parseSections(lang === 'en' ? textEn : textIt)

  const toggleLang = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLang(l => l === 'en' ? 'it' : 'en')
  }

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      className="rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-1 text-left"
        >
          <FileText className="w-5 h-5 flex-shrink-0" style={{ color: '#60a5fa' }} />
          <h3 style={{ color: 'var(--c-text)' }} className="text-base font-semibold">Executive Summary</h3>
        </button>

        <div className="flex items-center gap-2">
          {/* IT / EN toggle */}
          <div
            style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)' }}
            className="flex rounded-lg overflow-hidden text-xs font-semibold"
          >
            <button
              onClick={toggleLang}
              style={{
                backgroundColor: lang === 'it' ? '#60a5fa' : 'transparent',
                color: lang === 'it' ? '#fff' : 'var(--c-muted)',
              }}
              className="px-3 py-1.5 transition-colors"
            >
              IT
            </button>
            <button
              onClick={toggleLang}
              style={{
                backgroundColor: lang === 'en' ? '#60a5fa' : 'transparent',
                color: lang === 'en' ? '#fff' : 'var(--c-muted)',
              }}
              className="px-3 py-1.5 transition-colors"
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setExpanded(e => !e)}
            className="hover:opacity-70 transition-opacity"
          >
            {expanded
              ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--c-muted)' }} />
              : <ChevronDown className="w-4 h-4" style={{ color: 'var(--c-muted)' }} />
            }
          </button>
        </div>
      </div>

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
