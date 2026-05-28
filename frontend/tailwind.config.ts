import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        risk: {
          critical: '#dc2626',
          high: '#f97316',
          medium: '#eab308',
          low: '#3b82f6',
          info: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
