import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sun, Moon, Printer, Upload, Download } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'

type Tab = 'overview' | 'analytics' | 'vulnerabilities' | 'leaks' | 'certificates'

interface Props {
  open: boolean
  onClose: () => void
  tab: Tab
  onTab: (t: Tab) => void
  tabs: { id: Tab; label: string }[]
  isDark: boolean
  onToggleTheme: () => void
  onImport: () => void
  onExport: () => void
  onPrint: () => void
  domainName?: string
}

export const MobileSidebar: React.FC<Props> = ({
  open, onClose, tab, onTab, tabs, isDark, onToggleTheme,
  onImport, onExport, onPrint, domainName,
}) => {
  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleTab = (t: Tab) => { onTab(t); onClose() }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Sidebar panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{ backgroundColor: 'var(--bg-header)' }}
            className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <img
                src="/digimetrica-full-inverted-transparent@2x.png"
                alt="Digimetrica"
                className="h-7"
              />
              <button
                onClick={onClose}
                style={{ color: 'var(--c-muted)' }}
                className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Domain name */}
            {domainName && (
              <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--c-muted)' }} className="text-xs uppercase tracking-wide mb-0.5">Dominio</p>
                <p style={{ color: 'var(--c-text)' }} className="text-sm font-semibold">{domainName}</p>
              </div>
            )}

            {/* Navigation tabs */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <p style={{ color: 'var(--c-muted)' }} className="text-xs uppercase tracking-wide px-2 mb-3">Navigazione</p>
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleTab(id)}
                  style={{
                    backgroundColor: tab === id ? '#60a5fa18' : 'transparent',
                    color: tab === id ? '#60a5fa' : 'var(--c-muted)',
                    borderLeft: tab === id ? '3px solid #60a5fa' : '3px solid transparent',
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--c-muted)' }} className="text-xs uppercase tracking-wide px-2 mb-3">Azioni</p>

              <button
                onClick={() => { onImport(); onClose() }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#065f46' }}
              >
                <Upload className="w-4 h-4" />
                Importa Report
              </button>

              <button
                onClick={() => { onExport(); onClose() }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-text)' }}
              >
                <Download className="w-4 h-4" />
                Esporta Dati
              </button>

              <button
                onClick={() => { onPrint(); onClose() }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-muted)' }}
              >
                <Printer className="w-4 h-4" />
                Stampa / PDF
              </button>
            </div>

            {/* Footer — theme + language */}
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ borderTop: '1px solid var(--border)' }}>
              <LanguageSwitcher />
              <button
                onClick={onToggleTheme}
                style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-muted)' }}
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
