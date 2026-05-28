import React from 'react'

const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl ${className}`}
    style={{ backgroundColor: 'var(--bg-card-hi)' }}
  />
)

export const SkeletonLoader: React.FC = () => (
  <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
    {/* Header */}
    <div style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }} className="h-16 flex items-center px-6">
      <Bone className="h-8 w-40" />
      <div className="ml-auto flex gap-3">
        <Bone className="h-9 w-40" />
        <Bone className="h-9 w-24" />
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Meta */}
      <div className="flex justify-between">
        <div className="space-y-2"><Bone className="h-6 w-48" /><Bone className="h-3 w-72" /></div>
        <Bone className="h-7 w-28 rounded-full" />
      </div>

      {/* Risk banner */}
      <Bone className="h-40 w-full rounded-2xl" />

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Bone key={i} className="h-32 rounded-2xl" />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Bone className="h-80 rounded-2xl" />
        <Bone className="h-80 rounded-2xl" />
      </div>
    </div>
  </div>
)
