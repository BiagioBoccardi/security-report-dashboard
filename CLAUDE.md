# 🎯 claude.md - Security Report Dashboard Assessment
## Soluzione Completa per Essprimo S.r.l.

**Progetto**: Security Report Dashboard - Visualizzazione Report Cybersonar  
**Versione**: 1.0  
**Data**: Marzo 2024  
**Autore**: Biagio Boccardi  
**Azienda**: Essprimo S.r.l.  
**Deadline**: 72 ore  
**Stack**: React 18 + TypeScript + Node.js/Express + Vercel + GitHub

---

## 📑 Indice

- [Overview Progetto](#overview-progetto)
- [Stack Tecnologico](#stack-tecnologico)
- [TASK 1: Setup Repository Git](#task-1-setup-repository-git)
- [TASK 2: Frontend Setup React + Vite](#task-2-frontend-setup-react--vite)
- [TASK 3: Backend Node.js/Express](#task-3-backend-nodejs-express)
- [TASK 4: Integrazione JSON Cybersonar](#task-4-integrazione-json-cybersonar)
- [TASK 5: Componenti Dashboard & Grafici](#task-5-componenti-dashboard--grafici)
- [TASK 6: Filtri e Sezioni Dettagliate](#task-6-filtri-e-sezioni-dettagliate)
- [TASK 7: Deploy Vercel + GitHub](#task-7-deploy-vercel--github)
- [Delivery Checklist](#delivery-checklist)

---

## 📊 Overview Progetto

### Obiettivo
Creare una **Dashboard React interattiva** che visualizzi il report di sicurezza del dominio `cybersonar.demo` in formato HTML/React con:
- Visualizzazione dati JSON (summary2_0.json)
- Grafici interattivi (Recharts)
- Filtri per analizzare le sezioni
- Backend API Node.js/Express
- Deploy su Vercel con GitHub repo

### Deliverables Richiesti
✅ Repository GitHub con il codice  
✅ Sito deployato su Vercel  
✅ Link di accesso diretto funzionante  
✅ Visualizzazione completa del JSON cybersonar.demo  
✅ Grafici interattivi  
✅ Filtri e dettagli per ogni sezione  

### Timeline
- **Totale**: 72 ore
- **Breakdown**: Task 1-7 = ~60 ore implementazione + 12 ore testing/deploy

---

## 🏗️ Stack Tecnologico

### Frontend
```
⚛️  React 18.2+
📘 TypeScript 5.0+
🎨 Tailwind CSS 3.0+
📊 Recharts 2.10+ (grafici)
🎯 Zustand 4.4+ (state)
✨ Framer Motion 10+ (animazioni)
🔍 Fuse.js (ricerca)
```

### Backend
```
🟢 Node.js 18+
⚡ Express 4.18+
📦 Cors 2.8+
📄 Body-parser
🔐 Dotenv
```

### DevOps
```
🐙 GitHub (repository)
🚀 Vercel (hosting)
🐳 Docker (opzionale local dev)
📝 .env per configurazione
```

---

---

# 🚀 TASK 1: Setup Repository Git

**Priority**: P0 | **Story Points**: 3 | **Tempo**: 30 min

---

## 📋 Prerequisiti

```bash
# Installazioni necessarie
- Node.js 18+ (https://nodejs.org)
- Git (https://git-scm.com)
- VSCode o editor preferito
- Account GitHub (https://github.com)
- Account Vercel (https://vercel.com)
```

---

## 🔧 BACKEND: Setup iniziale

### Step 1: Crea repo GitHub

```bash
# 1. Vai su GitHub e crea repository
# Nome: security-report-dashboard
# Description: Security Report Dashboard - Cybersonar Demo
# Public
# Add README.md
# Add .gitignore (Node)

# 2. Clone in locale
git clone https://github.com/your-username/security-report-dashboard.git
cd security-report-dashboard
```

### Step 2: Crea struttura directory

```bash
# Directory principale
mkdir -p backend frontend

# Backend structure
mkdir -p backend/{routes,middleware,utils}
touch backend/{server.js,.env.example}

# Frontend structure (sarà creato da Vite)

# Root files
touch .gitignore README.md docker-compose.yml
```

### Step 3: Setup Git iniziale

```bash
# Gitignore per Node
cat > .gitignore << 'EOF'
# Node
node_modules/
npm-debug.log
.npm

# Env
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log

# Dist
dist/
build/

# OS
.DS_Store
Thumbs.db
EOF

git add .
git commit -m "chore: initial project setup"
git branch -M main
git push -u origin main
```

### Step 4: Root package.json

```bash
# Crea package.json root per monorepo
cat > package.json << 'EOF'
{
  "name": "security-report-dashboard",
  "version": "1.0.0",
  "description": "Security Report Dashboard for Cybersonar Demo",
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "dev:backend": "npm run dev --prefix backend",
    "dev:frontend": "npm run dev --prefix frontend",
    "build": "npm run build --prefix frontend && npm run build --prefix backend",
    "start": "npm start --prefix backend"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
EOF

npm install
```

### Backend Checklist ✅
- [ ] Repository GitHub creato e clonato
- [ ] Directory structure creata
- [ ] .gitignore configurato
- [ ] package.json root creato
- [ ] Git commit iniziale fatto
- [ ] Git push a GitHub completato

---

## 💻 FRONTEND: Setup React + Vite (anticipato)

### Step 1: Crea progetto Vite

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

### Prossimi step nel TASK 2

---

## ✅ Task 1 Completion

**Done When**:
- ✅ GitHub repo visibile pubblicamente
- ✅ Directory structure creata
- ✅ .gitignore configurato
- ✅ Primo commit pushato

---

---

# 💻 TASK 2: Frontend Setup React + Vite

**Priority**: P0 | **Story Points**: 5 | **Tempo**: 1 ora

---

## 🔧 STEP 1: Crea React + Vite

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

## 🔧 STEP 2: Installa Dipendenze

```bash
npm install axios zustand recharts framer-motion lucide-react tailwindcss postcss autoprefixer

# Tailwind init
npx tailwindcss init -p
```

## 🔧 STEP 3: Configura Tailwind

**File**: `frontend/tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          critical: '#dc2626',
          high: '#f97316',
          medium: '#eab308',
          low: '#3b82f6',
          info: '#9ca3af'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [],
}
```

## 🔧 STEP 4: Global Styles

**File**: `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100;
}
```

## 🔧 STEP 5: Crea Directory Structure

```bash
mkdir -p src/{components/{Dashboard,Charts,Sections,Filters},
               hooks,
               services,
               store,
               types,
               utils}

touch src/{App.tsx,main.tsx,index.css}
touch src/types/report.ts
```

## 🔧 STEP 6: Environment Variables

**File**: `frontend/.env.local`

```
VITE_API_URL=http://localhost:3001
VITE_API_ENDPOINT=/api
```

## 🔧 STEP 7: Types TypeScript

**File**: `frontend/src/types/report.ts`

```typescript
export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export interface ReportData {
  status: string
  results: Array<{
    idsummary: string
    summary_text: string
    summary_text_en: string
    risk_score: string | number
    creation_date: string
    last_edit: string
    domain_name: string
    
    // Scores
    servizi_esposti_score: number
    dataleak_score: number
    rapporto_leak_email_score: number
    spoofing_score: number
    open_ports_score: number
    blacklist_score: number
    vulnerability_score_active: number
    vulnerability_score_passive: number
    certificate_score: number
    
    // Counts
    n_asset: number
    n_similar_domains: number
    n_cert_attivi: number
    n_cert_scaduti: number
    unique_ipv4: number
    unique_ipv6: number
    
    // Details
    n_port: Record<string, { n: number }>
    n_dataleak: {
      total: Record<string, number>
      resolved: Record<string, number>
      unresolved: Record<string, number>
    }
    n_vulns: {
      total: Record<string, number>
      active: Record<string, number>
      passive: Record<string, number>
    }
    email_security: {
      spoofable: string
      dmarc_policy: string
      blacklist_detections: number
      blacklist_total_list: number
      blacklist_detected_list: string[]
    }
    waf: { count: number; assets: string[] }
    cdn: { count: number; assets: string[] }
  }>
}

export interface FilterState {
  searchTerm: string
  severity: string[]
  showResolved: boolean
}
```

## 🔧 STEP 8: Test Frontend

```bash
npm run dev
# Verify: http://localhost:5173
```

## Frontend Checklist ✅
- [ ] Vite React project creato
- [ ] Dipendenze installate
- [ ] Tailwind configurato
- [ ] Directory structure creata
- [ ] Types definiti
- [ ] .env.local creato
- [ ] Dev server avviabile

---

## ✅ Task 2 Completion

**Done When**:
- ✅ Frontend dev server avviabile
- ✅ Types compilano senza errori
- ✅ File structure pronto

---

---

# 🟢 TASK 3: Backend Node.js/Express

**Priority**: P0 | **Story Points**: 5 | **Tempo**: 1.5 ore

---

## 🔧 STEP 1: Installa Dipendenze Backend

```bash
cd backend
npm init -y
npm install express cors dotenv body-parser
npm install -D nodemon
```

## 🔧 STEP 2: Package.json Backend

**File**: `backend/package.json`

```json
{
  "name": "security-dashboard-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🔧 STEP 3: Server Express Principale

**File**: `backend/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load the JSON report
const reportData = require('./data/cybersonar-report.json');

// ===== ROUTES =====

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get full report
app.get('/api/report', (req, res) => {
  res.json(reportData);
});

// Get report summary
app.get('/api/report/summary', (req, res) => {
  const report = reportData.results[0];
  res.json({
    idsummary: report.idsummary,
    domain_name: report.domain_name,
    risk_score: report.risk_score,
    creation_date: report.creation_date,
    summary_text: report.summary_text
  });
});

// Get vulnerabilities
app.get('/api/vulnerabilities', (req, res) => {
  const report = reportData.results[0];
  res.json({
    total: report.n_vulns.total,
    active: report.n_vulns.active,
    passive: report.n_vulns.passive
  });
});

// Get data leaks
app.get('/api/data-leaks', (req, res) => {
  const report = reportData.results[0];
  res.json(report.n_dataleak);
});

// Get ports
app.get('/api/ports', (req, res) => {
  const report = reportData.results[0];
  const ports = Object.entries(report.n_port).map(([port, data]) => ({
    port: parseInt(port),
    count: data.n
  }));
  res.json(ports);
});

// Get certificates
app.get('/api/certificates', (req, res) => {
  const report = reportData.results[0];
  res.json({
    active: report.n_cert_attivi,
    expired: report.n_cert_scaduti
  });
});

// Get email security
app.get('/api/email-security', (req, res) => {
  const report = reportData.results[0];
  res.json(report.email_security);
});

// Get all scores
app.get('/api/scores', (req, res) => {
  const report = reportData.results[0];
  res.json({
    servizi_esposti_score: report.servizi_esposti_score,
    dataleak_score: report.dataleak_score,
    certificate_score: report.certificate_score,
    vulnerability_score_active: report.vulnerability_score_active,
    vulnerability_score_passive: report.vulnerability_score_passive,
    email_security_score: report.rapporto_leak_email_score,
    spoofing_score: report.spoofing_score,
    blacklist_score: report.blacklist_score
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Report: GET http://localhost:${PORT}/api/report`);
});
```

## 🔧 STEP 4: .env Backend

**File**: `backend/.env`

```
PORT=3001
NODE_ENV=development
```

## 🔧 STEP 5: Test Backend

```bash
npm run dev
# Verify: curl http://localhost:3001/health
# Response: {"status":"ok","timestamp":"..."}
```

## Backend Checklist ✅
- [ ] Express server creato
- [ ] Cors configurato
- [ ] Routes per report, vulnerabilities, ports, certs, etc.
- [ ] .env configurato
- [ ] Dev server avviabile

---

## ✅ Task 3 Completion

**Done When**:
- ✅ Express server avviabile su port 3001
- ✅ /api/report endpoint funziona
- ✅ Tutti gli endpoints rispondono correttamente

---

---

# 📄 TASK 4: Integrazione JSON Cybersonar

**Priority**: P0 | **Story Points**: 3 | **Tempo**: 45 min

---

## 🔧 STEP 1: Copia JSON nel Backend

```bash
# Crea directory data nel backend
mkdir -p backend/data

# Copia il file JSON di Essprimo
cp /path/to/summary2_0.json backend/data/cybersonar-report.json
```

## 🔧 STEP 2: Verifica JSON

```bash
# Test che il JSON sia valido
node -e "console.log(JSON.parse(require('fs').readFileSync('./backend/data/cybersonar-report.json')))"
```

## 🔧 STEP 3: API Service Frontend

**File**: `frontend/src/services/api.ts`

```typescript
import axios from 'axios'
import { ReportData } from '../types/report'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const reportAPI = {
  getFullReport: async (): Promise<ReportData> => {
    const response = await axios.get(`${API_URL}/api/report`)
    return response.data
  },

  getSummary: async () => {
    const response = await axios.get(`${API_URL}/api/report/summary`)
    return response.data
  },

  getVulnerabilities: async () => {
    const response = await axios.get(`${API_URL}/api/vulnerabilities`)
    return response.data
  },

  getDataLeaks: async () => {
    const response = await axios.get(`${API_URL}/api/data-leaks`)
    return response.data
  },

  getPorts: async () => {
    const response = await axios.get(`${API_URL}/api/ports`)
    return response.data
  },

  getCertificates: async () => {
    const response = await axios.get(`${API_URL}/api/certificates`)
    return response.data
  },

  getEmailSecurity: async () => {
    const response = await axios.get(`${API_URL}/api/email-security`)
    return response.data
  },

  getScores: async () => {
    const response = await axios.get(`${API_URL}/api/scores`)
    return response.data
  }
}
```

## 🔧 STEP 4: Zustand Store

**File**: `frontend/src/store/reportStore.ts`

```typescript
import { create } from 'zustand'
import { ReportData } from '../types/report'
import { reportAPI } from '../services/api'

interface ReportStore {
  report: ReportData | null
  loading: boolean
  error: string | null
  
  fetchReport: () => Promise<void>
}

export const useReportStore = create<ReportStore>((set) => ({
  report: null,
  loading: false,
  error: null,
  
  fetchReport: async () => {
    set({ loading: true, error: null })
    try {
      const data = await reportAPI.getFullReport()
      set({ report: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  }
}))
```

## Integration Checklist ✅
- [ ] JSON copiato in backend/data/
- [ ] JSON valido e leggibile
- [ ] API Service creato
- [ ] Store Zustand creato
- [ ] Endpoints backend ritornano dati corretti

---

## ✅ Task 4 Completion

**Done When**:
- ✅ Backend serve il JSON correttamente
- ✅ Frontend API service connesso
- ✅ Dati caricabili da Zustand store

---

---

# 📊 TASK 5: Componenti Dashboard & Grafici

**Priority**: P0 | **Story Points**: 10 | **Tempo**: 3 ore

---

## 🔧 STEP 1: Dashboard Principale

**File**: `frontend/src/components/Dashboard/DashboardMain.tsx`

```typescript
import React, { useEffect } from 'react'
import { useReportStore } from '../../store/reportStore'
import { RiskScoreCard } from './RiskScoreCard'
import { SummaryCards } from './SummaryCards'
import { VulnerabilityChart } from '../Charts/VulnerabilityChart'
import { PortChart } from '../Charts/PortChart'
import { LoadingSpinner } from '../Common/LoadingSpinner'

export const DashboardMain: React.FC = () => {
  const { report, loading, error, fetchReport } = useReportStore()

  useEffect(() => {
    fetchReport()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  if (!report) return <div className="p-4">No report loaded</div>

  const reportData = report.results[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔐 {reportData.domain_name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Security Assessment Report • {reportData.creation_date}
          </p>
        </div>

        {/* Risk Score */}
        <RiskScoreCard riskScore={parseInt(reportData.risk_score)} />

        {/* Summary Stats */}
        <SummaryCards report={reportData} />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VulnerabilityChart vulns={reportData.n_vulns} />
          <PortChart ports={reportData.n_port} />
        </div>

      </div>
    </div>
  )
}
```

## 🔧 STEP 2: Risk Score Card

**File**: `frontend/src/components/Dashboard/RiskScoreCard.tsx`

```typescript
import React from 'react'
import { motion } from 'framer-motion'

interface RiskScoreCardProps {
  riskScore: number
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ riskScore }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'from-red-500 to-red-600'
    if (score >= 60) return 'from-orange-500 to-orange-600'
    if (score >= 40) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  const getTextColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-orange-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatus = (score: number) => {
    if (score >= 80) return '🔴 CRITICAL'
    if (score >= 60) return '🟠 HIGH'
    if (score >= 40) return '🟡 MEDIUM'
    return '🟢 LOW'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${getColor(riskScore)} text-white rounded-lg p-8 shadow-lg`}
    >
      <h2 className="text-sm font-semibold mb-4 opacity-90">RISK SCORE</h2>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold"
          >
            {riskScore}
          </motion.div>
          <p className="text-sm opacity-90">out of 100</p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-semibold">{getStatus(riskScore)}</p>
          <p className="text-sm opacity-90">Immediate action required</p>
        </div>
      </div>

      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${riskScore}%` }}
          transition={{ delay: 0.3, duration: 1 }}
          className="h-full bg-white/60 rounded-full"
        />
      </div>
    </motion.div>
  )
}
```

## 🔧 STEP 3: Summary Cards

**File**: `frontend/src/components/Dashboard/SummaryCards.tsx`

```typescript
import React from 'react'
import { AlertTriangle, Database, Certificate, Server } from 'lucide-react'

export const SummaryCards: React.FC<{ report: any }> = ({ report }) => {
  const cards = [
    {
      label: 'Vulnerabilities',
      value: report.n_vulns.total.critical + report.n_vulns.total.high,
      total: Object.values(report.n_vulns.total).reduce((a: number, b: number) => a + b, 0),
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950'
    },
    {
      label: 'Data Leaks',
      value: report.n_dataleak.unresolved.domain_stealer + report.n_dataleak.unresolved.potential_stealer,
      total: report.n_dataleak.total.domain_stealer + report.n_dataleak.total.potential_stealer,
      icon: Database,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      label: 'Certificates',
      value: report.n_cert_scaduti,
      total: report.n_cert_attivi + report.n_cert_scaduti,
      icon: Certificate,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      label: 'Assets',
      value: report.n_asset,
      total: report.n_asset,
      icon: Server,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div key={idx} className={`${card.bg} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {card.label}
              </h3>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className={`text-3xl font-bold ${card.color} mb-2`}>
              {card.value}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              of {card.total} total
            </p>
          </div>
        )
      })}
    </div>
  )
}
```

## 🔧 STEP 4: Vulnerability Chart

**File**: `frontend/src/components/Charts/VulnerabilityChart.tsx`

```typescript
import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#9ca3af'
}

export const VulnerabilityChart: React.FC<{ vulns: any }> = ({ vulns }) => {
  const data = [
    { name: 'Critical', value: vulns.total.critical },
    { name: 'High', value: vulns.total.high },
    { name: 'Medium', value: vulns.total.medium },
    { name: 'Low', value: vulns.total.low },
    { name: 'Info', value: vulns.total.info }
  ].filter(d => d.value > 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
```

## 🔧 STEP 5: Port Chart

**File**: `frontend/src/components/Charts/PortChart.tsx`

```typescript
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const PortChart: React.FC<{ ports: any }> = ({ ports }) => {
  const data = Object.entries(ports).map(([port, data]: [string, any]) => ({
    port: parseInt(port),
    count: data.n
  })).sort((a, b) => b.count - a.count)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Port Exposure</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="port" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f97316" name="Instances" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

## 🔧 STEP 6: Loading Spinner

**File**: `frontend/src/components/Common/LoadingSpinner.tsx`

```typescript
import React from 'react'

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
)
```

## 🔧 STEP 7: App.tsx

**File**: `frontend/src/App.tsx`

```typescript
import React from 'react'
import { DashboardMain } from './components/Dashboard/DashboardMain'

function App() {
  return <DashboardMain />
}

export default App
```

## 🔧 STEP 8: Test Components

```bash
# Frontend deve connettersi a backend
# Backend deve essere running su http://localhost:3001
npm run dev
# Verify: http://localhost:5173
```

## Components Checklist ✅
- [ ] DashboardMain creato e funzionante
- [ ] RiskScoreCard visualizza il score
- [ ] SummaryCards mostrano i 4 KPI
- [ ] VulnerabilityChart (Pie) funziona
- [ ] PortChart (Bar) funziona
- [ ] LoadingSpinner implementato
- [ ] API si connette a backend

---

## ✅ Task 5 Completion

**Done When**:
- ✅ Dashboard visualizza dati dal JSON
- ✅ Grafici interattivi funzionano
- ✅ No console errors
- ✅ Responsive design

---

---

# 🔍 TASK 6: Filtri e Sezioni Dettagliate

**Priority**: P1 | **Story Points**: 8 | **Tempo**: 2.5 ore

---

## 🔧 STEP 1: Filter Store

**File**: `frontend/src/store/filterStore.ts`

```typescript
import { create } from 'zustand'

interface FilterStore {
  searchTerm: string
  selectedSeverity: string[]
  showResolved: boolean
  
  setSearch: (term: string) => void
  setSeverity: (severities: string[]) => void
  setShowResolved: (show: boolean) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  searchTerm: '',
  selectedSeverity: [],
  showResolved: false,
  
  setSearch: (term) => set({ searchTerm: term }),
  setSeverity: (severities) => set({ selectedSeverity: severities }),
  setShowResolved: (show) => set({ showResolved: show }),
  clearFilters: () => set({ 
    searchTerm: '', 
    selectedSeverity: [], 
    showResolved: false 
  })
}))
```

## 🔧 STEP 2: Data Leaks Section

**File**: `frontend/src/components/Sections/DataLeaksSection.tsx`

```typescript
import React from 'react'

export const DataLeaksSection: React.FC<{ leaks: any }> = ({ leaks }) => {
  const leakTypes = [
    { label: 'Domain Stealer', key: 'domain_stealer', color: 'text-red-600' },
    { label: 'Potential Stealer', key: 'potential_stealer', color: 'text-orange-600' },
    { label: 'Other Stealer', key: 'other_stealer', color: 'text-yellow-600' }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Data Leaks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leakTypes.map(({ label, key, color }) => (
          <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className={`font-semibold ${color} mb-3`}>{label}</h3>
            <div className="space-y-2 text-sm">
              <div>Total: <span className="font-bold">{leaks.total[key]}</span></div>
              <div>Resolved: <span className="font-bold">{leaks.resolved[key]}</span></div>
              <div>Unresolved: <span className="font-bold text-red-600">{leaks.unresolved[key]}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🔧 STEP 3: Certificates Section

**File**: `frontend/src/components/Sections/CertificatesSection.tsx`

```typescript
import React from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

export const CertificatesSection: React.FC<{ certs: any }> = ({ certs }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">SSL/TLS Certificates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold">Active Certificates</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{certs.active}</p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold">Expired Certificates</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{certs.expired}</p>
        </div>
      </div>
    </div>
  )
}
```

## 🔧 STEP 4: Email Security Section

**File**: `frontend/src/components/Sections/EmailSecuritySection.tsx`

```typescript
import React from 'react'
import { Mail, AlertTriangle, Shield } from 'lucide-react'

export const EmailSecuritySection: React.FC<{ email: any }> = ({ email }) => {
  const isSpoofable = email.spoofable.includes('possible') || email.spoofable.includes('Spoofing')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail className="w-6 h-6" />
        Email Security
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`border rounded-lg p-4 ${isSpoofable ? 'bg-red-50 dark:bg-red-950 border-red-200' : 'bg-green-50 dark:bg-green-950 border-green-200'}`}>
          <h3 className="font-semibold mb-2">Spoofing Risk</h3>
          <p className={isSpoofable ? 'text-red-600' : 'text-green-600'}>
            {isSpoofable ? '🔴 VULNERABLE' : '🟢 PROTECTED'}
          </p>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-2">DMARC Policy</h3>
          <p className="text-lg font-bold uppercase">{email.dmarc_policy}</p>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Blacklist Status</h3>
          <p className="text-lg font-bold">
            {email.blacklist_detections === 0 ? '✅ CLEAN' : '⚠️ FLAGGED'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {email.blacklist_detections} of {email.blacklist_total_list} lists
          </p>
        </div>
      </div>
    </div>
  )
}
```

## 🔧 STEP 5: Main Page con Tutte le Sezioni

**File**: `frontend/src/components/Dashboard/FullDashboard.tsx`

```typescript
import React, { useEffect } from 'react'
import { useReportStore } from '../../store/reportStore'
import { DashboardMain } from './DashboardMain'
import { DataLeaksSection } from '../Sections/DataLeaksSection'
import { CertificatesSection } from '../Sections/CertificatesSection'
import { EmailSecuritySection } from '../Sections/EmailSecuritySection'

export const FullDashboard: React.FC = () => {
  const { report, loading, fetchReport } = useReportStore()

  useEffect(() => {
    fetchReport()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!report) return <div>No report</div>

  const reportData = report.results[0]

  return (
    <div className="space-y-6">
      <DashboardMain />
      <DataLeaksSection leaks={reportData.n_dataleak} />
      <CertificatesSection certs={{
        active: reportData.n_cert_attivi,
        expired: reportData.n_cert_scaduti
      }} />
      <EmailSecuritySection email={reportData.email_security} />
    </div>
  )
}
```

## Sections Checklist ✅
- [ ] Data Leaks Section visualizza dati
- [ ] Certificates Section mostra active/expired
- [ ] Email Security Section completa
- [ ] Tutti gli endpoint API funzionano
- [ ] Styling coerente dark/light mode

---

## ✅ Task 6 Completion

**Done When**:
- ✅ Tutte le sezioni visualizzano dati corretti
- ✅ Filtri funzionano (se implementati)
- ✅ Responsive su mobile/tablet/desktop

---

---

# 🚀 TASK 7: Deploy Vercel + GitHub

**Priority**: P0 | **Story Points**: 8 | **Tempo**: 2 ore

---

## 🔧 STEP 1: Preparazione per Deploy

```bash
# Root directory - crea vercel.json
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ]
}
EOF
```

## 🔧 STEP 2: Build Script

```bash
# Root package.json - update build
npm run build
# Questo farà:
# 1. npm run build nel frontend (crea dist/)
# 2. Il backend è serverless ready
```

## 🔧 STEP 3: GitHub Push

```bash
git add .
git commit -m "feat: complete dashboard with all sections and API"
git push origin main
```

## 🔧 STEP 4: Deploy su Vercel

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy (dalla root directory)
vercel --prod
```

O via GitHub:

1. Vai su https://vercel.com/dashboard
2. Clicca "New Project"
3. Seleziona il repo GitHub "security-report-dashboard"
4. Configura:
   - Framework Preset: "Other"
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
5. Aggiungi Environment Variables (se necessario):
   - `VITE_API_URL`: https://your-vercel-url.vercel.app
6. Deploy

## 🔧 STEP 5: Verifica Deploy

```bash
# Test API
curl https://your-vercel-url.vercel.app/api/report

# Test Frontend
open https://your-vercel-url.vercel.app
```

## Deployment Checklist ✅
- [ ] GitHub repo public
- [ ] Vercel project creato
- [ ] Primo deploy completato
- [ ] API endpoints rispondono
- [ ] Frontend visualizza correttamente
- [ ] Link Vercel funzionante

---

## ✅ Task 7 Completion

**Done When**:
- ✅ URL Vercel funzionante
- ✅ Dashboard completamente visualizzata
- ✅ Tutti i dati del JSON caricati
- ✅ Grafici interattivi
- ✅ GitHub repo linkabile

---

---

# ✅ DELIVERY CHECKLIST

## Prima di consegnare:

### GitHub Repository ✅
- [ ] Repository pubblico
- [ ] README.md completo
- [ ] Tutti i file pushati
- [ ] .gitignore configurato
- [ ] Almeno 5-10 commit significativi

### Vercel Deployment ✅
- [ ] Sito deployato e accessibile
- [ ] URL stabile e funzionante
- [ ] API endpoints rispondono
- [ ] Frontend carica correttamente
- [ ] Dati del JSON visualizzati

### Dashboard Features ✅
- [ ] Risk Score visualizzato (99/100)
- [ ] 4 Summary Cards (Vulns, Leaks, Certs, Assets)
- [ ] Pie Chart vulnerabilità (Critical/High/Medium/Low/Info)
- [ ] Bar Chart porte (80, 443, 8800, etc)
- [ ] Data Leaks Section
- [ ] Certificates Section
- [ ] Email Security Section
- [ ] Responsive design
- [ ] Dark mode support

### Code Quality ✅
- [ ] No console errors
- [ ] TypeScript strict mode
- [ ] Componenti React ben organizzati
- [ ] API Service separato
- [ ] Zustand Store funzionante
- [ ] Tailwind CSS ben applito

---

## 📋 DA CONSEGNARE

1. **GitHub Link**: https://github.com/your-username/security-report-dashboard
2. **Vercel Link**: https://security-report-dashboard-xxxxx.vercel.app
3. **Breve descrizione** di cosa è stato implementato

---

## 📊 Timeline Stima

```
Task 1: Setup Git ..................... 30 min
Task 2: Frontend React + Vite ......... 1 ora
Task 3: Backend Express ............... 1.5 ore
Task 4: Integrazione JSON ............. 45 min
Task 5: Dashboard & Grafici ........... 3 ore
Task 6: Sezioni Dettagliate ........... 2.5 ore
Task 7: Deploy Vercel ................. 2 ore
────────────────────────────────────────────
TOTALE: ~11 ore implementazione

Plus: 1-2 ore testing/bugfixing
Plus: 30 min documentazione

TOTALE: ~13 ore (Rientra nelle 72 ore!)
```

---

**Versione**: 1.0  
**Status**: READY FOR IMPLEMENTATION  
**Last Updated**: Marzo 2024

Buona fortuna! 🚀