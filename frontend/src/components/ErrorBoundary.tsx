import React from 'react'

interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div
        style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}
        className="flex items-center justify-center"
      >
        <div
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="rounded-2xl p-10 max-w-lg text-center shadow-2xl"
        >
          <img
            src="/digimetrica-full-inverted-transparent@2x.png"
            alt="Digimetrica"
            className="h-10 mx-auto mb-6 opacity-70"
          />
          <p className="text-red-400 text-lg font-bold mb-2">Errore inatteso</p>
          <p style={{ color: 'var(--c-muted)' }} className="text-sm mb-6">
            {this.state.error?.message ?? 'Si è verificato un errore imprevisto.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Ricarica pagina
          </button>
        </div>
      </div>
    )
  }
}
