import React from 'react'

export const BackgroundEffect: React.FC = () => (
  <>
    {/* Fixed full-screen background layer */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none no-print" style={{ zIndex: 0 }}>
      {/* Grid */}
      <div className="absolute inset-0 bg-grid" />

      {/* Floating orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
    </div>

    {/* Scan line — outside the overflow:hidden container so it travels the full page */}
    <div className="scan-line no-print" />
  </>
)
