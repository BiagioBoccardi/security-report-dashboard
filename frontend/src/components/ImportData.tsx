import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, FileJson, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/services/api'
import { useReportStore } from '@/store/reportStore'

type Status = 'idle' | 'dragging' | 'uploading' | 'success' | 'error'

interface Props {
  onClose: () => void
}

export const ImportData: React.FC<Props> = ({ onClose }) => {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState<{ domain: string; risk_score: string } | null>(null)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { reinitialize } = useReportStore()

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setErrorMsg('Il file deve avere estensione .json')
      setStatus('error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Il file supera il limite di 10 MB')
      setStatus('error')
      return
    }

    setStatus('uploading')
    setProgress(0)

    // Simulate progress during upload
    const prog = setInterval(() => setProgress(p => Math.min(p + 12, 88)), 120)

    try {
      const res = await api.uploadReport(file)
      clearInterval(prog)
      setProgress(100)
      setResult({ domain: res.domain, risk_score: String(res.risk_score) })
      setStatus('success')
      toast.success(`Report "${res.domain}" importato con successo!`)

      // Atomic reinitialize: reset state + fetch list + fetch full report in sequence.
      // Avoids race conditions with Dashboard's useEffect([reports]).
      await reinitialize()
    } catch (err: unknown) {
      clearInterval(prog)
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        ?? 'Errore durante il caricamento del file'
      setErrorMsg(msg)
      setStatus('error')
    }
  }, [reinitialize])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setStatus('idle')
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setStatus('dragging') }
  const onDragLeave = () => setStatus('idle')
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const reset = () => { setStatus('idle'); setErrorMsg(''); setResult(null); setProgress(0) }

  return (
    /* Backdrop */
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <motion.div
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }} className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5" style={{ color: '#60a5fa' }} />
            <h2 style={{ color: 'var(--c-text)' }} className="font-semibold text-base">Importa Report JSON</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--c-muted)' }} className="hover:opacity-60 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* ── IDLE / DRAGGING ── */}
            {(status === 'idle' || status === 'dragging') && (
              <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => inputRef.current?.click()}
                  style={{
                    border: `2px dashed ${status === 'dragging' ? '#60a5fa' : 'var(--border)'}`,
                    backgroundColor: status === 'dragging' ? 'rgba(96,165,250,0.06)' : 'var(--bg-card-hi)',
                    transition: 'all 0.2s',
                  }}
                  className="rounded-xl p-10 flex flex-col items-center gap-4 cursor-pointer hover:border-blue-400 hover:bg-blue-400/5"
                >
                  <motion.div
                    animate={{ y: status === 'dragging' ? -6 : 0 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <FileJson className="w-12 h-12" style={{ color: status === 'dragging' ? '#60a5fa' : 'var(--c-muted)' }} />
                  </motion.div>
                  <div className="text-center">
                    <p style={{ color: 'var(--c-text)' }} className="font-medium text-sm mb-1">
                      {status === 'dragging' ? 'Rilascia il file qui' : 'Trascina il file JSON oppure'}
                    </p>
                    {status !== 'dragging' && (
                      <span style={{ color: '#60a5fa' }} className="text-sm font-semibold underline underline-offset-2">
                        sfoglia dal computer
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--c-muted)' }} className="text-xs">
                    Formato Cybersonar · Max 10 MB
                  </p>
                </div>
                <input ref={inputRef} type="file" accept=".json" className="hidden" onChange={onInputChange} />

                <p style={{ color: 'var(--c-muted)' }} className="text-xs text-center mt-4">
                  Il file sostituirà il report corrente e aggiornerà la dashboard automaticamente.
                </p>
              </motion.div>
            )}

            {/* ── UPLOADING ── */}
            {status === 'uploading' && (
              <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                >
                  <Upload className="w-10 h-10" style={{ color: '#60a5fa' }} />
                </motion.div>
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--c-muted)' }} className="text-xs">Caricamento in corso...</span>
                    <span style={{ color: '#60a5fa' }} className="text-xs font-bold">{progress}%</span>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card-hi)' }} className="h-2 rounded-full overflow-hidden">
                    <motion.div
                      style={{ backgroundColor: '#60a5fa' }}
                      className="h-full rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </div>
                <p style={{ color: 'var(--c-muted)' }} className="text-sm">
                  Validazione e importazione report...
                </p>
              </motion.div>
            )}

            {/* ── SUCCESS ── */}
            {status === 'success' && result && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <CheckCircle className="w-14 h-14" style={{ color: '#4ade80' }} />
                </motion.div>
                <div>
                  <p style={{ color: '#4ade80' }} className="text-lg font-bold mb-1">Importazione completata!</p>
                  <p style={{ color: 'var(--c-text)' }} className="text-sm font-medium">{result.domain}</p>
                  <p style={{ color: 'var(--c-muted)' }} className="text-xs mt-1">
                    Risk Score: <span style={{ color: Number(result.risk_score) >= 80 ? '#f87171' : '#fbbf24' }} className="font-bold">{result.risk_score}/100</span>
                  </p>
                </div>
                <p style={{ color: 'var(--c-muted)' }} className="text-xs">La dashboard è stata aggiornata automaticamente.</p>
                <div className="flex gap-3 mt-2 w-full">
                  <button onClick={reset}
                    style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-muted)' }}
                    className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity">
                    Importa un altro
                  </button>
                  <button onClick={onClose}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Chiudi
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── ERROR ── */}
            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <AlertCircle className="w-14 h-14" style={{ color: '#f87171' }} />
                </motion.div>
                <div>
                  <p style={{ color: '#f87171' }} className="text-lg font-bold mb-2">Importazione fallita</p>
                  <p style={{ color: 'var(--c-muted)' }} className="text-sm leading-relaxed">{errorMsg}</p>
                </div>
                <div className="flex gap-3 mt-2 w-full">
                  <button onClick={reset}
                    style={{ backgroundColor: 'var(--bg-card-hi)', border: '1px solid var(--border)', color: 'var(--c-muted)' }}
                    className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity">
                    Riprova
                  </button>
                  <button onClick={onClose}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Chiudi
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
