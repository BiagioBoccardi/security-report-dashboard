import React, { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLangStore } from '@/store/langStore'
import { LANGUAGES, type Lang } from '@/i18n/translations'

export const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useLangStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANGUAGES[lang]

  return (
    <div ref={ref} className="relative no-print">
      <button
        onClick={() => setOpen(o => !o)}
        title="Change language / Cambia lingua"
        style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-muted)' }}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:opacity-80 transition-opacity"
      >
        <span className="text-base leading-none select-none">{current.flag}</span>
        <Globe className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="absolute right-0 top-full mt-2 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[190px] py-1"
        >
          {(Object.entries(LANGUAGES) as [Lang, (typeof LANGUAGES)[Lang]][]).map(([code, info]) => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false) }}
              style={{
                color: lang === code ? '#60a5fa' : 'var(--c-text)',
                backgroundColor: lang === code ? '#60a5fa18' : 'transparent',
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-70 transition-opacity text-left"
            >
              <span className="text-lg leading-none select-none w-7 text-center">{info.flag}</span>
              <span className="font-medium">{info.nativeName}</span>
              {lang === code && (
                <span className="ml-auto text-xs opacity-60">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
