# 🔐 Security Report Dashboard

> Dashboard interattiva per la visualizzazione e l'analisi di report di sicurezza Cybersonar — sviluppata per **Digimetrica S.r.l.**

![CI](https://github.com/BiagioBoccardi/security-report-dashboard/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 📸 Preview

| Tab | Contenuto principale |
|---|---|
| **Overview** | Risk Score 99/100 · KPI animate · Score Breakdown · Recommendations · Executive Summary |
| **Analytics** | Risk Trend 7g · Radar Chart 9 aree · Pie + Bar chart · Heatmap · Email Security |
| **Vulnerabilities** | Tabella severity con sparkline trend · filtri · searchbar |
| **Data Leaks** | Domain Stealer · Potential Stealer · Other Stealer (total / resolved / unresolved) |
| **Certificates** | SSL/TLS active vs expired · Certificate score · Email Security DMARC/Blacklist |

> Demo live: [security-report-dashboard.vercel.app](https://security-report-dashboard.vercel.app) *(deploy in corso)*

---

## ✨ Funzionalità

### Core
| Feature | Descrizione |
|---|---|
| **Risk Score Banner** | Punteggio 0–100 con gradient colorato e progress bar animata |
| **KPI Cards animate** | Counter animati (easeOutCubic) con copy-to-clipboard |
| **Tab Navigation** | 5 tab con URL sync — `?tab=analytics` — e back button funzionante |
| **Dark / Light Mode** | Toggle persistente in localStorage |
| **Print / PDF** | CSS ottimizzato per stampa, header/nav nascosti |

### Analytics
| Feature | Descrizione |
|---|---|
| **Risk Trend Chart** | Line chart 7 giorni con reference lines CRITICAL/HIGH |
| **Score Radar Chart** | Spider chart per 9 aree di rischio (0–100) |
| **Score Breakdown** | Progress bar animate per ogni score, ordinate per criticità |
| **Vulnerability Heatmap** | Matrice total/active/passive × severity |
| **Port Exposure Chart** | Bar chart porte esposte Top 10 |
| **Vulnerability Pie** | Pie chart distribuzione per severity |

### Intelligence
| Feature | Descrizione |
|---|---|
| **Recommendations Engine** | 8+ azioni consigliate generate automaticamente dai dati JSON |
| **Executive Summary** | `summary_text_en` parsato in sezioni collassabili |
| **Security Infrastructure** | WAF, CDN, Similar Domains con status colorato |
| **Trend Column** | Mini sparkline SVG + freccia ↑↓ nella Vuln Table |

### Qualità tecnica
| Feature | Descrizione |
|---|---|
| **React Error Boundary** | Fallback UI professionale per errori runtime |
| **Skeleton Loading** | Placeholder bones (stile LinkedIn) durante il caricamento |
| **GitHub Actions CI/CD** | TypeScript check + build ad ogni push |
| **CSS Variables Theme** | Sistema di theming completo dark/light via CSS custom properties |

---

## 🏗 Stack

```
Frontend          Backend
──────────────    ──────────────────────
React 18          Python 3.12
TypeScript 5      FastAPI 0.115
Vite 5            Uvicorn
Tailwind CSS 3    Pydantic v2
Recharts 2        python-dotenv
Framer Motion
Zustand
```

---

## 🚀 Avvio rapido

### Prerequisiti
- Node.js 18+ · Python 3.12+ · npm 9+

### 1. Clone
```bash
git clone https://github.com/BiagioBoccardi/security-report-dashboard.git
cd security-report-dashboard
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env

# Aggiungi il report JSON
cp /path/to/summary2_0.json data/cybersonar-report.json

uvicorn main:app --reload --port 8000
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 3. Frontend
```bash
cd frontend
npm install
# crea .env.local con VITE_API_URL=http://localhost:8000
npm run dev
# → http://localhost:3000
```

### Docker Compose (alternativa)
```bash
docker-compose up
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

---

## 📡 API Endpoints

| Method | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/reports` | Lista report |
| `GET` | `/api/v1/reports/{id}` | Dettaglio report |
| `GET` | `/api/v1/reports/{id}/vulnerabilities` | Vulnerabilità (filtri: severity, status, limit) |
| `GET` | `/api/v1/reports/{id}/analytics` | Trend 7 giorni + distribuzione |
| `GET` | `/api/v1/reports/{id}/export?format=csv` | Export CSV |
| `GET` | `/api/v1/reports/{id}/export?format=json` | Export JSON |

---

## 📂 Struttura

```
security-report-dashboard/
├── frontend/                   # React 18 + TypeScript (porta 3000)
│   ├── src/
│   │   ├── components/         # 15+ componenti React
│   │   ├── hooks/              # useCounter, useReportData, useFilters
│   │   ├── services/           # api.ts, exportService, reportService
│   │   ├── store/              # Zustand (report + filter state)
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # colors, constants
│   ├── public/                 # Digimetrica logo
│   └── vite.config.ts
│
├── backend/                    # Python FastAPI (porta 8000)
│   ├── main.py                 # App entry point + CORS
│   ├── routes/                 # health, reports, vulnerabilities, analytics, export
│   ├── services/               # report_analyzer, analytics_service, export_service
│   ├── models/                 # Pydantic models
│   ├── utils/                  # constants, formatters, validators
│   └── data/                   # cybersonar-report.json (non in repo)
│
├── .github/workflows/ci.yml    # GitHub Actions CI
└── docker-compose.yml
```

---

## 🔐 Variabili d'ambiente

### Frontend (`frontend/.env.local`)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Security Report Dashboard
```

### Backend (`backend/.env`)
```env
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000
API_PORT=8000
```

---

## 🌐 Deploy

| Servizio | Configurazione |
|---|---|
| **Vercel** (Frontend) | Root: `frontend` · Build: `npm run build` · Output: `dist` |
| **Railway** (Backend) | Root: `backend` · Start: `uvicorn main:app --host 0.0.0.0` |

---

## 👨‍💻 Autore

**Biagio Boccardi**  
[GitHub](https://github.com/BiagioBoccardi) · [LinkedIn](https://linkedin.com/in/biagio-boccardi) · biagioboccardi@gmail.com

---

*Sviluppato per Digimetrica S.r.l. come technical assessment — Marzo 2024*
