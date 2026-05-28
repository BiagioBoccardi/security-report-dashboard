import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { BackgroundEffect } from './BackgroundEffect'

/* ── Animated SVG: due nodi, linea spezzata, pacchetti persi ── */
const NetworkDisconnect: React.FC = () => {
  return (
    <div className="relative w-72 h-36">
      <svg viewBox="0 0 320 130" className="w-full h-full overflow-visible">

        {/* ── Client node (sinistra) ── */}
        <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <circle cx="60" cy="60" r="34"
            fill="rgba(22,37,72,0.9)"
            stroke="rgba(96,165,250,0.5)"
            strokeWidth="1.5"
          />
          {/* Server rack icon */}
          <rect x="43" y="49" width="34" height="7" rx="2" fill="rgba(96,165,250,0.55)" />
          <rect x="43" y="60" width="34" height="7" rx="2" fill="rgba(96,165,250,0.35)" />
          <rect x="43" y="71" width="34" height="7" rx="2" fill="rgba(96,165,250,0.2)" />
          <circle cx="51" cy="52.5" r="2" fill="#4ade80" />
          <circle cx="51" cy="63.5" r="2" fill="#4ade80" />
          <motion.circle cx="51" cy="74.5" r="2" fill="#4ade80"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <text x="60" y="108" textAnchor="middle" fill="rgba(122,144,184,0.7)" fontSize="9" fontFamily="monospace">CLIENT</text>
        </motion.g>

        {/* ── Server node (destra — OFFLINE) ── */}
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {/* Pulsing error rings */}
          {[0, 0.6, 1.2].map((delay, i) => (
            <motion.circle key={i} cx="260" cy="60" r="34" fill="none"
              stroke="rgba(239,68,68,0.4)" strokeWidth="1.2"
              animate={{ r: [34, 56], opacity: [0.6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay, ease: 'easeOut' }}
            />
          ))}
          <circle cx="260" cy="60" r="34"
            fill="rgba(40,8,8,0.9)"
            stroke="rgba(239,68,68,0.5)"
            strokeWidth="1.5"
          />
          {/* Server rack icon — red */}
          <rect x="243" y="49" width="34" height="7" rx="2" fill="rgba(239,68,68,0.35)" />
          <rect x="243" y="60" width="34" height="7" rx="2" fill="rgba(239,68,68,0.2)" />
          <rect x="243" y="71" width="34" height="7" rx="2" fill="rgba(239,68,68,0.1)" />
          {/* Blinking error lights */}
          <motion.circle cx="251" cy="52.5" r="2" fill="#ef4444"
            animate={{ opacity: [1, 0.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.circle cx="251" cy="63.5" r="2" fill="#ef4444"
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
          <motion.circle cx="251" cy="74.5" r="2" fill="#f97316"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <text x="260" y="108" textAnchor="middle" fill="rgba(248,113,113,0.7)" fontSize="9" fontFamily="monospace">SERVER</text>
        </motion.g>

        {/* ── Dashed connection line (si disegna e si ferma a metà) ── */}
        <motion.line
          x1="95" y1="60" x2="225" y2="60"
          stroke="rgba(96,165,250,0.25)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        {/* Half-line that draws (client → break point) */}
        <motion.line
          x1="95" y1="60" x2="155" y2="60"
          stroke="rgba(96,165,250,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
        />

        {/* Break symbol ✕ at midpoint */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1, 1, 0], opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.32, 0.4, 0.7, 1] }}
          style={{ transformOrigin: '160px 60px' }}
        >
          <line x1="151" y1="51" x2="169" y2="69" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="169" y1="51" x2="151" y2="69" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>

        {/* ── Data packets (pallini che viaggiano e scompaiono al break) ── */}
        {[0, 1.1, 2.2].map((delay, i) => (
          <motion.circle key={i} cy="60" r="4"
            fill="rgba(96,165,250,0.8)"
            initial={{ cx: 95, opacity: 0 }}
            animate={{ cx: [95, 155, 155], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6, delay, ease: 'easeIn', times: [0, 0.7, 1] }}
          />
        ))}

      </svg>
    </div>
  )
}

/* ── Typing dots ───────────────────────────────────────────── */
function useTypingDots(): string {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(t)
  }, [])
  return dots
}

/* ── Main NoConnection component ──────────────────────────── */
interface Props {
  error: string
  onRetry: () => void
}

export const NoConnection: React.FC<Props> = ({ error, onRetry }) => {
  const [retrying, setRetrying] = useState(false)
  const dots = useTypingDots()

  const handleRetry = () => {
    setRetrying(true)
    setTimeout(() => { onRetry(); setRetrying(false) }, 1400)
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}
      className="flex flex-col items-center justify-center relative overflow-hidden">

      <BackgroundEffect />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg px-6">

        {/* Logo */}
        <motion.img
          src="/digimetrica-full-inverted-transparent@2x.png"
          alt="Digimetrica"
          className="h-9 mb-14 opacity-60"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Animated SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <NetworkDisconnect />
        </motion.div>

        {/* Title */}
        <motion.h2
          style={{ color: 'var(--c-text)' }}
          className="text-2xl font-bold mt-6 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          Backend non raggiungibile
        </motion.h2>

        <motion.p
          style={{ color: 'var(--c-muted)' }}
          className="text-sm leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Impossibile connettersi al server FastAPI.<br />
          <span className="text-xs opacity-75">{error}</span>
        </motion.p>

        {/* Command hint */}
        <motion.div
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="rounded-xl px-5 py-3 mb-8 font-mono text-xs flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 }}
        >
          <span style={{ color: '#4ade80' }}>$</span>
          <span style={{ color: 'var(--c-text)' }}>uvicorn main:app --reload --port 8000</span>
        </motion.div>

        {/* Retry button */}
        <motion.button
          onClick={handleRetry}
          disabled={retrying}
          className="flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: '#1d4ed8', opacity: retrying ? 0.8 : 1 }}
          whileHover={!retrying ? { scale: 1.04, backgroundColor: '#2563eb' } : {}}
          whileTap={!retrying ? { scale: 0.97 } : {}}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.span
            animate={{ rotate: retrying ? 360 : 0 }}
            transition={{ duration: 0.9, repeat: retrying ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.span>
          {retrying ? `Connessione in corso${dots}` : 'Riprova connessione'}
        </motion.button>

        {/* Footer hint */}
        <motion.p
          style={{ color: 'var(--c-muted)' }}
          className="text-xs mt-8 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.1 }}
        >
          Security Report Dashboard · Digimetrica S.r.l.
        </motion.p>

      </div>
    </div>
  )
}
