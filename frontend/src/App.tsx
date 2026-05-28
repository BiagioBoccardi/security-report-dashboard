import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Dashboard } from './components/Dashboard'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--c-text)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontSize: 13,
          },
        }}
      />
    </ErrorBoundary>
  )
}

export default App
