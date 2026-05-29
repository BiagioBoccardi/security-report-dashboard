# 📋 Analisi dei Requisiti Funzionali e Non Funzionali
## Security Report Dashboard - CyberSonar

**Data**: Marzo 2024  
**Versione**: 1.0  
**Autore**: Biagio Boccardi  
**Stakeholder**: Essprimo S.r.l.

---

## 📑 Indice

1. [Panoramica](#panoramica)
2. [Requisiti Funzionali](#requisiti-funzionali)
3. [Requisiti Non Funzionali](#requisiti-non-funzionali)
4. [Vincoli Tecnici](#vincoli-tecnici)
5. [Assunzioni](#assunzioni)
6. [Dipendenze](#dipendenze)
7. [Matrice di Tracciabilità](#matrice-di-tracciabilità)

---

## 🎯 Panoramica

### Descrizione del Progetto
Sviluppare una dashboard interattiva per la visualizzazione e l'analisi di report di sicurezza complessi. La soluzione permette ai security professionals di:
- Caricare e analizzare report JSON di security assessment
- Visualizzare in tempo reale il risk score complessivo
- Esplorare vulnerabilità, fuga di dati e certificati
- Filtrare e ricercare informazioni critiche
- Esportare report in più formati
- Analizzare trend storici

### Scope del Progetto

#### IN SCOPE
✅ Dashboard di visualizzazione security data  
✅ Backend API REST con Python FastAPI  
✅ Frontend React con TypeScript  
✅ Grafici e heat map interattivi  
✅ Filtri avanzati e search  
✅ Export PDF/CSV  
✅ Dark mode  
✅ Deployment su Vercel + Railway  

#### OUT OF SCOPE
❌ Integrazione con sistemi di ticketing  
❌ Machine Learning per risk prediction (v2.0)  
❌ Real-time data sync (v1.1)  
❌ User authentication (v1.1)  
❌ Multi-domain orchestration  

### Utenti Target
- **Security Engineers** - Analisi vulnerabilità quotidiana
- **DevOps Professionals** - Monitoring asset e certificati
- **Risk Managers** - Overview rischi complessivi
- **CTOs/Security Leads** - Strategic decision-making
- **Compliance Officers** - Audit trail e reportistica

---

## 🔧 Requisiti Funzionali

### RF.1 Gestione Report

#### RF.1.1 Caricamento Report
**Descrizione**: L'utente deve poter caricare un file JSON contente il report di security assessment.

**Criteri di Accettazione**:
- ✅ L'utente può selezionare un file JSON dal file system
- ✅ Validazione del file JSON (schema validation)
- ✅ Parsing automatico e caricamento in memoria
- ✅ Messaggio di successo/errore dopo il caricamento
- ✅ Supporto per file fino a 50MB
- ✅ Drag & drop interface per il caricamento

**Dettagli Tecnici**:
- Input: File JSON (multipart/form-data)
- Output: Caricamento dati in store + redirect dashboard
- Handler Error: Mostra toast con errore specifico
- Validazione: Schema Pydantic lato backend

**Priorità**: P0 (Critica)  
**Complessità**: Alta  
**Story Points**: 8

---

#### RF.1.2 Caricamento Dati Demo
**Descrizione**: L'utente deve poter caricare dati demo per esplorare la dashboard senza file personali.

**Criteri di Accettazione**:
- ✅ Pulsante "Load Demo Data" visibile sulla home
- ✅ Caricamento istantaneo di report demo cybersonar.demo
- ✅ Popola dashboard con 100+ vulnerabilità mock
- ✅ Include dati per tutti i parametri (ports, certs, leaks, etc)
- ✅ Possibilità di ricaricare dati demo in qualsiasi momento

**Dettagli Tecnici**:
- Dati: Mock data JSON in memoria
- Trigger: Endpoint `GET /api/v1/demo-data`
- Storage: Zustand store
- Visibilità: Home screen + Sidebar

**Priorità**: P1 (Alta)  
**Complessità**: Bassa  
**Story Points**: 3

---

#### RF.1.3 Visualizzazione Metadati Report
**Descrizione**: L'utente deve visualizzare informazioni generali del report (dominio, date, punteggio).

**Criteri di Accettazione**:
- ✅ Header con nome dominio analizzato
- ✅ Risk score prominente (0-100 scala)
- ✅ Data creazione report visibile
- ✅ Data ultima modifica visibile
- ✅ Numero asset totali monitorati
- ✅ Numero domini simili identificati

**Dettagli Tecnici**:
- Componente: `Header.tsx` + `RiskScoreCard.tsx`
- Dati: Da `results[0]` del JSON
- Layout: Card con risk score + Info row

**Priorità**: P0 (Critica)  
**Complessità**: Bassa  
**Story Points**: 5

---

### RF.2 Visualizzazione Dati

#### RF.2.1 Dashboard Overview
**Descrizione**: Visualizzazione centralizzata di tutti i KPI principali del report.

**Criteri di Accettazione**:
- ✅ 4 Summary Cards: Total Vulnerabilities, Data Leaks, Certificates, Assets
- ✅ Risk Score Gauge (animato 0-100)
- ✅ Color coding per livello rischio (Critical=Rosso, High=Arancio, etc)
- ✅ Quick Stats: IPv4/IPv6 count, WAF protected, CDN enabled
- ✅ Alert banner per rischi critici (Risk Score > 80)
- ✅ Responsive design (mobile, tablet, desktop)

**Dettagli Tecnici**:
- Componenti:
  - `DashboardMain.tsx` (layout principale)
  - `RiskScoreCard.tsx` (gauge animato)
  - `SummaryCards.tsx` (KPI cards)
  - `AlertBanner.tsx` (avvisi)
- Dati: Aggregazione da `results[0]`
- Animation: Framer Motion per gauge

**Priorità**: P0 (Critica)  
**Complessità**: Media  
**Story Points**: 13

---

#### RF.2.2 Tabella Vulnerabilità
**Descrizione**: Tabella interattiva con lista completa vulnerabilità.

**Criteri di Accettazione**:
- ✅ Colonne: ID, Titolo, Severity, Status, CVE, Porta, Data scoperta
- ✅ Paginazione: 25, 50, 100 righe per pagina
- ✅ Sorting: Per qualsiasi colonna (ascendente/discendente)
- ✅ Color coding severity: Critical (Rosso), High (Arancio), Medium (Giallo), Low (Blu), Info (Grigio)
- ✅ Badge status: Active (Verde), Passive (Grigio)
- ✅ Click su riga: Apre modal con dettagli completi
- ✅ Selezione multipla: Checkbox per batch export

**Dettagli Tecnici**:
- Componente: `VulnerabilitiesSection.tsx`
- Tabella: React Table library
- Dati: Aggregazione da `n_vulns` + details
- Columns: 7 principali + sortable

**Priorità**: P0 (Critica)  
**Complessità**: Alta  
**Story Points**: 13

---

#### RF.2.3 Modal Dettagli Vulnerabilità
**Descrizione**: Visualizzazione approfondita di una singola vulnerabilità.

**Criteri di Accettazione**:
- ✅ Title, Description, CVE/ID
- ✅ Severity badge + color
- ✅ Status (Active/Passive)
- ✅ Port affected
- ✅ Discovery date + Last update
- ✅ Asset(s) impattati
- ✅ CVSS Score (se disponibile)
- ✅ Remediation recommendations
- ✅ Button "Close" e "Export this vuln"

**Dettagli Tecnici**:
- Componente: `VulnerabilityDetailModal.tsx`
- Trigger: Click su riga tabella vulnerabilità
- Gestione Modal: Zustand uiStore
- Contenuto: Expandable sections

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 8

---

#### RF.2.4 Sezione Data Leak
**Descrizione**: Visualizzazione fughe di dati suddivise per categoria.

**Criteri di Accettazione**:
- ✅ Tabella con colonne: Tipo, Totali, Risolti, Non Risolti
- ✅ Categorie: Domain Stealer, Potential Stealer, Other Stealer, VIP, General
- ✅ Card summary con count totale leaks: 838
- ✅ Indicatori visivi: Resolved (✅), Unresolved (⚠️)
- ✅ Trend chart: Andamento leaks negli ultimi 7 giorni
- ✅ Click su categoria: Drill-down con dettagli singoli leak

**Dettagli Tecnici**:
- Componente: `DataLeaksSection.tsx`
- Tabella: Custom table component
- Chart: `DataLeakTrendChart.tsx` (Recharts)
- Dati: `n_dataleak` object dal JSON

**Priorità**: P0 (Critica)  
**Complessità**: Media  
**Story Points**: 10

---

#### RF.2.5 Sezione Certificati
**Descrizione**: Gestione e visualizzazione dello stato dei certificati SSL/TLS.

**Criteri di Accettazione**:
- ✅ Summary cards: 15 Attivi, 18 Scaduti
- ✅ Tabella certificati con colonne: Dominio, Issuer, Expiration, Status
- ✅ Badge status: Valid (Verde), Expired (Rosso), Expires Soon (Giallo)
- ✅ Timeline visuale: Countdown giorni rimasti (es. "45 days")
- ✅ Sorting: Per expiration date (prossimi prima)
- ✅ Alert: Evidenzia certificati che scadono tra <30 giorni
- ✅ Click per dettagli certificato

**Dettagli Tecnici**:
- Componente: `CertificatesSection.tsx`
- Timeline: `CertificateTimeline.tsx` custom component
- Dati: `n_cert_attivi`, `n_cert_scaduti`
- Calcolo giorni: Utility function

**Priorità**: P0 (Critica)  
**Complessità**: Media  
**Story Points**: 10

---

#### RF.2.6 Sezione Porte Esposte
**Descrizione**: Dettagli sulle porte aperte e vulnerabilità associate.

**Criteri di Accettazione**:
- ✅ Tabella con colonne: Porta, Istanze, High Severity Count, Medium Count, Info Count
- ✅ Porte monitorate: 80, 443, 8800, 53, 6697, 6667, 8080
- ✅ Sorting: Per numero istanze (discendente)
- ✅ Severity distribution: Visual bar chart per porta
- ✅ Click su porta: Mostra vulnerabilità specifiche porta
- ✅ Color coding severity per colonna

**Dettagli Tecnici**:
- Componente: `PortsSection.tsx`
- Tabella: Custom con bar chart per riga
- Dati: `n_port` object
- Chart: Mini bar chart per severity distribution

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 8

---

#### RF.2.7 Sezione Email Security
**Descrizione**: Visualizzazione stato sicurezza email domain.

**Criteri di Accettazione**:
- ✅ Spoofing Risk: Indicator (Vulnerabile/Safe)
- ✅ DMARC Policy: Mostra policy corrente (quarantine, reject, none)
- ✅ Blacklist Status: 0 detections su 60 liste (grafico)
- ✅ Badge per ogni parametro con status visuale
- ✅ Raccomandazioni di hardening

**Dettagli Tecnici**:
- Componente: `EmailSecuritySection.tsx`
- Dati: `email_security` object
- Layout: 3 Cards con indicators

**Priorità**: P1 (Alta)  
**Complessità**: Bassa  
**Story Points**: 5

---

#### RF.2.8 Sezione WAF/CDN Status
**Descrizione**: Visualizzazione protezioni WAF e CDN attive.

**Criteri di Accettazione**:
- ✅ WAF Status: 4 asset protetti (badge Verde)
- ✅ WAF Asset List: UUID assets protetti
- ✅ CDN Status: 0 enabled (badge Grigio)
- ✅ Visual indicators: Checkmark per attivo, X per inattivo
- ✅ Recommendation banner se CDN non abilitato

**Dettagli Tecnici**:
- Componente: `WafCdnSection.tsx`
- Dati: `waf` e `cdn` objects
- Layout: 2 Cards side-by-side

**Priorità**: P2 (Media)  
**Complessità**: Bassa  
**Story Points**: 4

---

#### RF.2.9 Sezione Domini Simili
**Descrizione**: Visualizzazione domini simili identificati a rischio.

**Criteri di Accettazione**:
- ✅ Mostra 13 domini simili identificati
- ✅ Tabella: Domain, Similarity Score, Status, Risks
- ✅ Badge per tipo rischio (typosquatting, homograph, etc)
- ✅ Sorting: Per similarity score
- ✅ Alert: Evidenzia domini simili con rischi critici

**Dettagli Tecnici**:
- Componente: `SimilarDomainsSection.tsx`
- Dati: `n_similar_domains` + mock details
- Tabella: Custom table

**Priorità**: P2 (Media)  
**Complessità**: Bassa  
**Story Points**: 4

---

### RF.3 Grafici Interattivi

#### RF.3.1 Vulnerability Distribution Chart
**Descrizione**: Grafico a torta distribuzione vulnerabilità per severity.

**Criteri di Accettazione**:
- ✅ Pie chart con 5 sezioni: Critical (2), High (18), Medium (52), Low (0), Info (90)
- ✅ Colori: Rosso (Critical), Arancio (High), Giallo (Medium), Blu (Low), Grigio (Info)
- ✅ Legend interattiva: Click per filtrare tabella
- ✅ Hover: Mostra percentuale e count
- ✅ Tooltip: Severity label

**Dettagli Tecnici**:
- Componente: `VulnerabilityChart.tsx`
- Library: Recharts PieChart
- Dati: Aggregazione da `n_vulns.total`
- Interattività: onClick filter trigger

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 8

---

#### RF.3.2 Port Exposure Chart
**Descrizione**: Grafico a barre porte esposte.

**Criteri di Accettazione**:
- ✅ Bar chart: Porte X-axis, Numero istanze Y-axis
- ✅ 7 porte: 80 (68), 443 (42), 8800 (21), 53 (3), 6697 (9), 6667 (9), 8080 (6)
- ✅ Sorting: Decrescente per istanze
- ✅ Color: Gradiente intensità (più istanze = più scuro)
- ✅ Hover: Mostra numero esatto istanze
- ✅ Click: Filtra tabella per porta

**Dettagli Tecnici**:
- Componente: `PortExposureChart.tsx`
- Library: Recharts BarChart
- Dati: `n_port` object
- Interattività: onClick filter

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 6

---

#### RF.3.3 Data Leak Trend Chart
**Descrizione**: Grafico linea trend fughe di dati nel tempo.

**Criteri di Accettazione**:
- ✅ Line chart: Giorni X-axis, Count leaks Y-axis
- ✅ 7 giorni di dati simulati (T-6 a T0)
- ✅ 3 linee: Domain Stealer, Potential Stealer, Other Stealer
- ✅ Colori: Rosso (Domain), Arancio (Potential), Blu (Other)
- ✅ Hover: Mostra valori esatti per giorno
- ✅ Legend: Clickable per toggle linee

**Dettagli Tecnici**:
- Componente: `DataLeakTrendChart.tsx`
- Library: Recharts LineChart
- Dati: Mock trend data (generato da trend service)
- Interattività: Legend toggle

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 8

---

#### RF.3.4 Risk Heat Map (2D Matrix)
**Descrizione**: Matrice bidimensionale dei rischi.

**Criteri di Accettazione**:
- ✅ Assi: X = Vulnerabilità severity, Y = Numero istanze esposte
- ✅ Celle colorate: Gradiente rosso (alto rischio) a verde (basso rischio)
- ✅ Celle cliccabili: Drill-down dettagli
- ✅ Tooltip: Mostra severity + count
- ✅ Legend scala colori
- ✅ Responsive: Adatta griglia a viewport

**Dettagli Tecnici**:
- Componente: `RiskHeatmap.tsx`
- Library: Custom SVG + D3 (o Recharts)
- Dati: Aggregazione vulnerabilità + asset count
- Interattività: Cell click for details

**Priorità**: P2 (Media)  
**Complessità**: Alta  
**Story Points**: 13

---

#### RF.3.5 Port Severity Heat Map
**Descrizione**: Heat map mostra quale porta espone quali severity.

**Criteri di Accettazione**:
- ✅ Righe: Porte (80, 443, 8800, etc)
- ✅ Colonne: Severity levels (Critical, High, Medium, Low, Info)
- ✅ Celle: Count vulnerabilità (colore per intensità)
- ✅ Hover: Mostra esatto count
- ✅ Click cella: Filtra vulnerabilità per porta+severity

**Dettagli Tecnici**:
- Componente: `PortSeverityHeatmap.tsx`
- Library: Custom SVG o Recharts
- Dati: Aggregazione porte + severità
- Colore: Color scale per count

**Priorità**: P2 (Media)  
**Complessità**: Alta  
**Story Points**: 10

---

### RF.4 Filtri e Ricerca

#### RF.4.1 Filter by Severity
**Descrizione**: Filtro vulnerabilità per livello di severità.

**Criteri di Accettazione**:
- ✅ Multi-select dropdown: Critical, High, Medium, Low, Info
- ✅ Default: Tutti selezionati
- ✅ Click severity: Seleziona/deseleziona
- ✅ Applica filtro: Aggiorna tabella vulnerabilità in real-time
- ✅ Mostra count: "15 of 162 vulnerabilities"
- ✅ Clear button: Resetta filtro

**Dettagli Tecnici**:
- Componente: `SeverityFilter.tsx`
- State: Zustand filterStore
- Trigger: onChange event
- Applicazione: Hook useFilters per logic

**Priorità**: P0 (Critica)  
**Complessità**: Media  
**Story Points**: 6

---

#### RF.4.2 Filter by Status
**Descrizione**: Filtro vulnerabilità per status (Active/Passive).

**Criteri di Accettazione**:
- ✅ Radio buttons: Active, Passive, All
- ✅ Default: All
- ✅ Click: Aggiorna tabella in tempo reale
- ✅ Mostra count: "92 of 162 vulnerabilities"
- ✅ Combina con altri filtri (severity, ports)

**Dettagli Tecnici**:
- Componente: `StatusFilter.tsx`
- State: Zustand filterStore
- Trigger: onChange event
- Applicazione: Combined filtering logic

**Priorità**: P1 (Alta)  
**Complessità**: Bassa  
**Story Points**: 4

---

#### RF.4.3 Filter by Port
**Descrizione**: Filtro vulnerabilità per porta esposta.

**Criteri di Accettazione**:
- ✅ Multi-select dropdown: 80, 443, 8800, 53, 6697, 6667, 8080
- ✅ Default: Tutti selezionati
- ✅ Click port: Seleziona/deseleziona
- ✅ Badge count per porta
- ✅ Applica filtro in tempo reale
- ✅ Clear button

**Dettagli Tecnici**:
- Componente: `PortFilter.tsx`
- State: Zustand filterStore
- Dati: Extract unique ports da `n_port`
- Interattività: Multi-select dropdown

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 6

---

#### RF.4.4 Filter by Date Range
**Descrizione**: Filtro report per range date.

**Criteri di Accettazione**:
- ✅ Opzioni: Last 7 days, Last 30 days, Custom
- ✅ Custom: Date picker from-to
- ✅ Applica filtro in tempo reale
- ✅ Default: Last 7 days (per trend analysis)
- ✅ Mostra range selezionato

**Dettagli Tecnici**:
- Componente: `DateRangeFilter.tsx`
- Library: React DatePicker
- State: Zustand filterStore
- Applicazione: Trend data filtering

**Priorità**: P2 (Media)  
**Complessità**: Media  
**Story Points**: 6

---

#### RF.4.5 Smart Search Bar
**Descrizione**: Ricerca full-text avanzata con query parsing.

**Criteri di Accettazione**:
- ✅ Input field con auto-complete
- ✅ Query parsing: "port 443", "critical", "stealer", "CVE-2024"
- ✅ Search across: Vulnerability titles, descriptions, CVE
- ✅ Highlighting: Risultati evidenziati in tabella
- ✅ Results count: "5 matches found"
- ✅ Suggestion dropdown: Completamento automatico
- ✅ Funziona con altri filtri (combinazione)

**Dettagli Tecnici**:
- Componente: `SmartSearch.tsx`
- Library: Fuse.js per fuzzy search
- State: Zustand searchStore
- Hook: useSearch per logic
- Highlighting: Custom className per matched terms

**Priorità**: P1 (Alta)  
**Complessità**: Alta  
**Story Points**: 10

---

#### RF.4.6 Combined Filtering
**Descrizione**: Applicazione contemporanea di multipli filtri.

**Criteri di Accettazione**:
- ✅ AND logic: Severity + Status + Port + Date
- ✅ Real-time update: Aggiornamento istantaneo tabella
- ✅ Active filters display: Badge per ogni filtro attivo
- ✅ Remove filter: Click X su badge rimuove singolo filtro
- ✅ Clear all: Button per resettare tutti filtri
- ✅ Results count: "X of Y matching"

**Dettagli Tecnici**:
- Hook: useFilters con logica combinata
- State: Zustand filterStore
- Applicazione: Tabella vulnerabilità
- UI: Filter badge panel

**Priorità**: P1 (Alta)  
**Complessità**: Alta  
**Story Points**: 8

---

### RF.5 Export Functionality

#### RF.5.1 Export to PDF
**Descrizione**: Generazione report PDF formattato.

**Criteri di Accettazione**:
- ✅ Button "Export PDF" in dashboard
- ✅ Genera PDF con:
  - Cover page (dominio, risk score, date)
  - Executive summary (ITA + EN)
  - Tabella vulnerabilità (filtrate se applicate)
  - Grafici: Pie chart, Bar chart, Trend
  - Tabella data leaks
  - Tabella certificati
  - Sezione raccomandazioni
- ✅ File size: < 5MB
- ✅ Scaricabile: nomefile_YYYY-MM-DD.pdf

**Dettagli Tecnici**:
- Componente: `ExportModal.tsx`
- Library: react-pdf / jsPDF
- Trigger: Button click
- Backend: POST `/api/v1/reports/{id}/export?format=pdf`
- Dati inclusi: Report completo + filtri applicati

**Priorità**: P1 (Alta)  
**Complessità**: Alta  
**Story Points**: 13

---

#### RF.5.2 Export to CSV
**Descrizione**: Esportazione dati raw in formato CSV.

**Criteri di Accettazione**:
- ✅ Button "Export CSV" in dashboard
- ✅ CSV include:
  - Vulnerabilità: ID, Title, Severity, Status, CVE, Port, Date
  - Data Leaks: Type, Total, Resolved, Unresolved
  - Certificates: Domain, Issuer, Expiry, Status
- ✅ Dati filtrati secondo filtri attivi
- ✅ Encoding: UTF-8
- ✅ Separatore: Virgola (,)

**Dettagli Tecnici**:
- Componente: `ExportModal.tsx`
- Library: papaparse (JS) o csv (Backend)
- Backend: POST `/api/v1/reports/{id}/export?format=csv`
- Filename: `security-report_YYYY-MM-DD.csv`

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 6

---

#### RF.5.3 Export to JSON
**Descrizione**: Esportazione dati completo in formato JSON.

**Criteri di Accettazione**:
- ✅ Button "Export JSON"
- ✅ JSON contiene: Intero report + metadati + filtri applicati
- ✅ Pretty-printed (indentazione)
- ✅ Preserva struttura originale

**Dettagli Tecnici**:
- Componente: `ExportModal.tsx`
- Library: JSON stringify
- Backend: GET `/api/v1/reports/{id}?format=json`

**Priorità**: P2 (Media)  
**Complessità**: Bassa  
**Story Points**: 3

---

### RF.6 Theme & UI

#### RF.6.1 Dark Mode
**Descrizione**: Toggle tema scuro per ridurre affaticamento visivo.

**Criteri di Accettazione**:
- ✅ Toggle button (Moon/Sun icon) in header
- ✅ Dark mode applicato globalmente
- ✅ Colori readabili in dark mode (contrast ratio >= 4.5:1)
- ✅ Salva preferenza in localStorage
- ✅ Persiste tra sessioni
- ✅ Smooth transition tra temi

**Dettagli Tecnici**:
- Store: Zustand themeStore
- Hook: useTheme
- Implementation: Tailwind dark: prefix
- Storage: localStorage per persistenza

**Priorità**: P2 (Media)  
**Complessità**: Bassa  
**Story Points**: 5

---

#### RF.6.2 Responsive Design
**Descrizione**: Dashboard responsive su tutti i device.

**Criteri di Accettazione**:
- ✅ Desktop (>1200px): Layout completo, 3 colonne
- ✅ Tablet (768-1200px): Layout 2 colonne adattato
- ✅ Mobile (<768px): Single column, stack verticale
- ✅ Tabelle: Scrollable su mobile con sticky header
- ✅ Grafici: Ridimensionabili responsive
- ✅ Breakpoints: xs, sm, md, lg, xl

**Dettagli Tecnici**:
- Framework: Tailwind CSS con responsive prefixes
- Media queries: xs(320px), sm(640px), md(768px), lg(1024px), xl(1280px)
- Layout: CSS Grid + Flexbox
- Components: Shadcn/ui responsive

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 13

---

#### RF.6.3 Loading States
**Descrizione**: Indicatori di caricamento durante operazioni async.

**Criteri di Accettazione**:
- ✅ Spinner during report load
- ✅ Skeleton screens per tabelle
- ✅ Loading state per grafici
- ✅ Disabilita interazioni durante caricamento
- ✅ Timeout fallback (>30s)

**Dettagli Tecnici**:
- Componente: `LoadingSpinner.tsx`
- Library: Framer Motion per animazioni
- State: React Loading + error states
- UX: Smooth transitions

**Priorità**: P1 (Alta)  
**Complessità**: Media  
**Story Points**: 6

---

### RF.7 Analytics & Trends

#### RF.7.1 Trend Analysis Dashboard
**Descrizione**: Visualizzazione dati storici trend sicurezza.

**Criteri di Accettazione**:
- ✅ 7 giorni di dati simulati (trend)
- ✅ Risk Score Evolution: Linea trend punteggio
- ✅ New Vulnerabilities: Bar chart scoperte giornaliere
- ✅ Data Leak Progression: Trend leaks nel tempo
- ✅ Certificate Expiry: Timeline prossime scadenze
- ✅ Annotations: Marker per eventi significativi

**Dettagli Tecnici**:
- Hook: useTrendData
- Service: analyticsService.generateTrends()
- Storage: Mock data in memory
- Charts: Multiple Recharts componenti

**Priorità**: P2 (Media)  
**Complessità**: Media  
**Story Points**: 10

---

#### RF.7.2 Risk Score Timeline
**Descrizione**: Evoluzione risk score nel tempo.

**Criteri di Accettazione**:
- ✅ Line chart: Giorni X-axis, Risk Score Y-axis (0-100)
- ✅ 7 giorni dati (T-6 a T0)
- ✅ Trend indicator: ↑ (peggio), → (stabile), ↓ (migliore)
- ✅ Hover: Mostra score esatto per giorno
- ✅ Annotation: Marker per vulnerabilità critiche scoperte

**Dettagli Tecnici**:
- Componente: Chart in Analytics tab
- Library: Recharts LineChart
- Dati: Mock trend data
- Calculation: Risk score formula simulata

**Priorità**: P2 (Media)  
**Complessità**: Media  
**Story Points**: 7

---

### RF.8 Navigation & Layout

#### RF.8.1 Main Navigation
**Descrizione**: Navigazione principale tra sezioni dashboard.

**Criteri di Accettazione**:
- ✅ Sidebar con menu principale
- ✅ Menu items: Overview, Vulnerabilities, Data Leaks, Certificates, Ports, Email, WAF/CDN, Analytics
- ✅ Active indicator: Evidenzia sezione corrente
- ✅ Collapsible: Menu collassabile su mobile
- ✅ Logo link: Torna a home
- ✅ Smooth transitions tra pagine

**Dettagli Tecnici**:
- Componente: `Sidebar.tsx` + `Header.tsx`
- Router: React Router v6
- State: URL pathname
- UI: Tailwind + Icons

**Priorità**: P0 (Critica)  
**Complessità**: Media  
**Story Points**: 8

---

#### RF.8.2 Header with Top Actions
**Descrizione**: Header con logo, theme toggle, e quick actions.

**Criteri di Accettazione**:
- ✅ Logo a sinistra (torna home)
- ✅ Dominio nome al centro
- ✅ Risk score score indicator
- ✅ Dark mode toggle (destra)
- ✅ Export button (destra)
- ✅ Help icon (?) con tooltip
- ✅ Sticky position

**Dettagli Tecnici**:
- Componente: `Header.tsx`
- Layout: Flexbox horizontal
- Icons: Lucide React
- Sticky: CSS position: sticky

**Priorità**: P0 (Critica)  
**Complessità**: Bassa  
**Story Points**: 5

---

#### RF.8.3 Footer with Info
**Descrizione**: Footer con informazioni app.

**Criteri di Accettazione**:
- ✅ Copyright notice
- ✅ Version number
- ✅ Last update timestamp
- ✅ Links: Docs, Support, GitHub

**Dettagli Tecnici**:
- Componente: `Footer.tsx`
- Content: Static text + dynamic version
- Layout: Simple footer bar

**Priorità**: P2 (Media)  
**Complessità**: Bassa  
**Story Points**: 2

---

---

## ⚙️ Requisiti Non Funzionali

### RNF.1 Scalabilità

#### RNF.1.1 Data Volume Scalability
**Descrizione**: Sistema deve gestire report di grandi dimensioni.

**Requisiti**:
- ✅ Supporta file JSON fino a 50MB
- ✅ Gestisce report con 1000+ vulnerabilità
- ✅ Paginazione automatica per tabelle grandi
- ✅ Virtual scrolling per liste lunghe
- ✅ Lazy loading per grafici/charts

**Implementazione**:
- Frontend: React Table con virtual scrolling
- Backend: Pagination con offset/limit
- Storage: Indexing per ricerca veloce

**Priorità**: P1  
**Complessità**: Alta

---

#### RNF.1.2 Concurrent Users
**Descrizione**: Supporto per multipli utenti contemporanei.

**Requisiti**:
- ✅ Minimo 100 utenti contemporanei
- ✅ Frontend: SPA statico (no server-side sessions)
- ✅ Backend: Stateless API REST

**Implementazione**:
- Frontend: Deployment statico Vercel (auto-scaling)
- Backend: FastAPI stateless + Railway auto-scaling

**Priorità**: P1  
**Complessità**: Media

---

### RNF.2 Performance

#### RNF.2.1 Page Load Time
**Descrizione**: Velocità caricamento dashboard.

**Requisiti**:
- ✅ First Contentful Paint (FCP): < 2 secondi
- ✅ Time to Interactive (TTI): < 3.5 secondi
- ✅ Largest Contentful Paint (LCP): < 2.5 secondi
- ✅ Cumulative Layout Shift (CLS): < 0.1

**Implementazione**:
- Code splitting: Lazy loading routes
- Bundle size: < 500KB gzipped (JS)
- Image optimization: Webp, lazy load
- CSS: Critical CSS inline, rest deferred

**Monitoring**:
- Google Lighthouse scores >= 80/100
- WebVitals monitoring

**Priorità**: P1  
**Complessità**: Alta

---

#### RNF.2.2 API Response Time
**Descrizione**: Latenza response time backend.

**Requisiti**:
- ✅ GET /api/v1/reports: < 500ms
- ✅ GET /api/v1/vulnerabilities: < 800ms
- ✅ GET /api/v1/analytics: < 1000ms
- ✅ Export endpoints: < 5 secondi

**Implementazione**:
- Database: In-memory caching
- Indexing: Per query frequenti
- CDN: Caching responses non sensitive
- Compression: GZIP per responses

**Monitoring**:
- APM tracking (Sentry, New Relic)
- P95 latency < 1000ms

**Priorità**: P1  
**Complessità**: Alta

---

#### RNF.2.3 Bundle Size Optimization
**Descrizione**: Minimizzazione footprint applicazione.

**Requisiti**:
- ✅ JavaScript bundle: < 500KB (gzipped)
- ✅ CSS: < 100KB (gzipped)
- ✅ Initial load: < 1MB assets
- ✅ Lazy load charts/modals

**Implementazione**:
- Tree-shaking: Unused code removal
- Code splitting: Per route/feature
- Dynamic imports: Async loading
- Library optimization: Prefer lightweight alternatives

**Tools**:
- Webpack Bundle Analyzer
- Lighthouse
- Bundle Size CI checks

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.2.4 Memory Management
**Descrizione**: Utilizzo efficiente memoria browser/backend.

**Requisiti**:
- ✅ Frontend memory: < 200MB (per large report)
- ✅ Backend memory: < 500MB process
- ✅ No memory leaks su long sessions
- ✅ Garbage collection: Efficiente

**Implementazione**:
- Frontend: Zustand store optimization
- Backend: Connection pooling
- Monitoring: Memory profiling tools

**Priorità**: P2  
**Complessità**: Alta

---

### RNF.3 Affidabilità

#### RNF.3.1 Uptime
**Descrizione**: Disponibilità del servizio.

**Requisiti**:
- ✅ Frontend: 99.9% uptime (Vercel)
- ✅ Backend: 99.5% uptime (Railway)
- ✅ Graceful degradation on failures

**Implementazione**:
- Managed hosting con SLA
- Health checks: Endpoint `/health`
- Monitoring: Uptime robot / Datadog
- Alerting: Slack notifications

**Priorità**: P1  
**Complessità**: Bassa

---

#### RNF.3.2 Error Handling
**Descrizione**: Gestione errori robusti.

**Requisiti**:
- ✅ Try-catch per operazioni async
- ✅ User-friendly error messages
- ✅ Validation errors specifici (Pydantic)
- ✅ Fallback UI su errori
- ✅ Error logging per debugging
- ✅ Max retry attempts: 3 con backoff

**Implementazione**:
- Frontend: Error boundary + toast notifications
- Backend: Exception handlers per endpoint
- Logging: Sentry per error tracking
- Retry logic: Exponential backoff (100ms, 200ms, 400ms)

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.3.3 Data Integrity
**Descrizione**: Integrità dati durante elaborazione.

**Requisiti**:
- ✅ Validazione input Pydantic schema
- ✅ JSON schema validation
- ✅ Type safety TypeScript
- ✅ No data mutation
- ✅ Atomic operations

**Implementazione**:
- Frontend: Immutable state (Zustand)
- Backend: Pydantic models per validation
- Testing: Unit tests per data operations

**Priorità**: P1  
**Complessità**: Media

---

### RNF.4 Sicurezza

#### RNF.4.1 Input Validation
**Descrizione**: Validazione rigorosa input dati.

**Requisiti**:
- ✅ Whitelist allowed ports (80, 443, etc)
- ✅ Sanitize text input
- ✅ Validate severity levels (critical, high, medium, low, info)
- ✅ Validate date formats
- ✅ File size limits (50MB max)
- ✅ JSON schema validation

**Implementazione**:
- Frontend: Client-side validation
- Backend: Pydantic validators
- Library: Joi/Yup per schema validation

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.4.2 CORS & CSRF Protection
**Descrizione**: Protezione cross-origin requests.

**Requisiti**:
- ✅ CORS headers: Soli origins autorizzati
- ✅ Preflight requests handled
- ✅ CSRF token (se state-changing operations)
- ✅ X-Frame-Options: DENY
- ✅ Content-Security-Policy headers

**Implementazione**:
- Backend: FastAPI CORS middleware
- Headers: Security headers via middleware
- Config: ENV var per allowed origins

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.4.3 File Upload Security
**Descrizione**: Sicurezza upload file JSON.

**Requisiti**:
- ✅ File type validation (JSON only)
- ✅ File size limit: 50MB
- ✅ Virus scanning (opzionale)
- ✅ No code execution
- ✅ Sanitize filename

**Implementazione**:
- Backend: Magic bytes validation
- Size checks: Pre-upload + post-upload
- Filename sanitization: Regex filter

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.4.4 Rate Limiting
**Descrizione**: Protezione contro abuse.

**Requisiti**:
- ✅ Rate limit: 100 requests/minute per IP
- ✅ Backoff strategy: Exponential
- ✅ Alert on suspicious activity

**Implementazione**:
- Backend: FastAPI middleware rate limiter
- Storage: Redis per rate limit tracking (opzionale per MVP)
- Headers: X-RateLimit-* response headers

**Priorità**: P2  
**Complessità**: Media

---

#### RNF.4.5 JWT Ready
**Descrizione**: Sistema pronto per autenticazione.

**Requisiti**:
- ✅ Architecture ready per JWT tokens
- ✅ Token validation logic prepared
- ✅ Secure token storage (httpOnly cookies)
- ✅ Token refresh mechanism

**Implementazione**:
- Backend: JWT validation endpoints prepared (not enforced v1.0)
- Frontend: Auth service skeleton
- Security: No public API keys exposed

**Priorità**: P2 (v1.1)  
**Complessità**: Media

---

### RNF.5 Usabilità

#### RNF.5.1 Accessibility (WCAG 2.1 AA)
**Descrizione**: Accessibilità per utenti con disabilità.

**Requisiti**:
- ✅ Semantic HTML: <button>, <table>, <form>
- ✅ ARIA labels: Per screen readers
- ✅ Keyboard navigation: Tab, Enter, Escape
- ✅ Color contrast: >= 4.5:1 (normal text), >= 3:1 (large text)
- ✅ Focus indicators: Visibili
- ✅ Alt text: Per immagini/icons
- ✅ Form labels: Associated <label> tags

**Implementazione**:
- Testing: Axe, WAVE, Lighthouse
- Components: Use semantic HTML
- Icons: aria-label per icon-only buttons
- Colors: Not only color to convey info

**Scoring**: WCAG AA compliance (axe accessibility checker)

**Priorità**: P2  
**Complessità**: Media

---

#### RNF.5.2 Internationalization (i18n)
**Descrizione**: Supporto lingue multiple (base per UI).

**Requisiti**:
- ✅ Testi UI tradotti: ITA, EN
- ✅ Date formatting: Locale-aware
- ✅ Numbers: Locale-aware separators
- ✅ RTL-ready (opzionale)
- ✅ Easy adding new languages

**Implementazione**:
- Library: react-i18next
- Translation files: JSON per lingua
- Fallback: EN se traduzione manca

**Priorità**: P2  
**Complessità**: Media

---

#### RNF.5.3 Mobile First Design
**Descrizione**: Progettazione orientata mobile.

**Requisiti**:
- ✅ Touch-friendly: Button min 44x44px
- ✅ Readable on small screens
- ✅ Scrollable content, not horizontal
- ✅ Fast on slow networks (3G)
- ✅ Offline support consideration

**Implementazione**:
- Design: Mobile breakpoint first
- Testing: Device testing (phones, tablets)
- Performance: Optimized for mobile networks

**Priorità**: P1  
**Complessità**: Media

---

### RNF.6 Compatibilità

#### RNF.6.1 Browser Support
**Descrizione**: Compatibilità browser.

**Requisiti**:
- ✅ Chrome: Latest 2 versions
- ✅ Firefox: Latest 2 versions
- ✅ Safari: Latest 2 versions
- ✅ Edge: Latest 2 versions
- ✅ Mobile browsers: iOS Safari, Chrome Mobile

**Implementazione**:
- Babel transpilation: ES6+ to ES5
- Polyfills: Fetch, Promise
- Testing: BrowserStack testing

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.6.2 Python Version Compatibility
**Descrizione**: Compatibilità versioni Python.

**Requisiti**:
- ✅ Python 3.11+
- ✅ Type hints: PEP 484
- ✅ No deprecated libraries
- ✅ Future-proof code

**Implementazione**:
- Docker: Python 3.11 base image
- Testing: tox per multiple versions
- Dependencies: Updated requirements.txt

**Priorità**: P1  
**Complessità**: Bassa

---

### RNF.7 Manutenibilità

#### RNF.7.1 Code Quality
**Descrizione**: Qualità codice e best practices.

**Requisiti**:
- ✅ ESLint + Prettier (Frontend)
- ✅ Black + Flake8 (Backend)
- ✅ TypeScript strict mode
- ✅ Type coverage: >= 80%
- ✅ Code reviews via PR
- ✅ Consistent style

**Implementazione**:
- CI: GitHub Actions linting
- Pre-commit hooks: Automatic formatting
- Config files: .eslintrc, .prettierrc, pyproject.toml

**Priorità**: P1  
**Complessità**: Bassa

---

#### RNF.7.2 Testing Coverage
**Descrizione**: Coverage test adeguato.

**Requisiti**:
- ✅ Frontend: >= 80% coverage (critical paths)
- ✅ Backend: >= 85% coverage
- ✅ Unit tests: Per functions/components
- ✅ Integration tests: Per features
- ✅ E2E tests: Critical user flows
- ✅ CI: Tests on every PR

**Implementazione**:
- Frontend: Jest + React Testing Library
- Backend: Pytest + Pytest-cov
- CI: GitHub Actions workflows

**Priorità**: P1  
**Complessità**: Alta

---

#### RNF.7.3 Documentation
**Descrizione**: Documentazione code e architettura.

**Requisiti**:
- ✅ README.md: Setup + features
- ✅ API docs: Swagger/OpenAPI
- ✅ Code comments: Per complex logic
- ✅ Architecture docs: Design decisions
- ✅ Contributing guidelines
- ✅ Changelog

**Implementazione**:
- Docs: /docs folder + README
- API: FastAPI auto-generates Swagger at /docs
- Comments: JSDoc/docstrings

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.7.4 Version Control
**Descrizione**: Gestione versioni e branches.

**Requisiti**:
- ✅ Git flow: main, develop, feature branches
- ✅ Commit messages: Conventional Commits
- ✅ PR reviews: Approvazione prima merge
- ✅ Semantic versioning: v1.0.0

**Implementazione**:
- GitHub: Branch protection rules
- Actions: Auto CI checks
- Releases: Tagged versions

**Priorità**: P1  
**Complessità**: Bassa

---

### RNF.8 Monitoraggio & Analytics

#### RNF.8.1 Error Tracking
**Descrizione**: Monitoraggio errori production.

**Requisiti**:
- ✅ Frontend errors: Sentry integration
- ✅ Backend errors: Sentry + logs
- ✅ Error alerts: Slack notifications
- ✅ Error grouping: Deduplicated
- ✅ Stack traces: Full context

**Implementazione**:
- Sentry: SDK per frontend + backend
- Slack: Sentry integration
- Config: DSN in .env

**Priorità**: P2  
**Complessità**: Media

---

#### RNF.8.2 Performance Monitoring
**Descrizione**: Tracking performance metrics.

**Requisiti**:
- ✅ Frontend: Web Vitals tracking
- ✅ Backend: Response time APM
- ✅ Database: Query performance
- ✅ Dashboards: Grafana/Datadog

**Implementazione**:
- Frontend: web-vitals library
- Backend: APM middleware
- Storage: Time-series DB (opzionale)

**Priorità**: P2  
**Complessità**: Media

---

#### RNF.8.3 Usage Analytics
**Descrizione**: Tracking user behavior.

**Requisiti**:
- ✅ Page views tracking
- ✅ Feature usage (export, filter)
- ✅ User flow analysis
- ✅ Session tracking
- ✅ Privacy compliant (GDPR)

**Implementazione**:
- Analytics: Google Analytics 4 (GA4) o Plausible
- Privacy: No PII tracking
- Consent: Cookie consent banner

**Priorità**: P3  
**Complessità**: Bassa

---

### RNF.9 DevOps & Deployment

#### RNF.9.1 Containerization
**Descrizione**: Docker per reproducibility.

**Requisiti**:
- ✅ Dockerfile per backend
- ✅ docker-compose per local dev
- ✅ Multi-stage builds per optimization
- ✅ No hardcoded secrets
- ✅ Health checks in Dockerfile

**Implementazione**:
- Backend Dockerfile: Python 3.11 Alpine
- docker-compose.yml: Frontend + Backend services
- .dockerignore: Exclude unnecessary files

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.9.2 CI/CD Pipeline
**Descrizione**: Automazione build, test, deploy.

**Requisiti**:
- ✅ GitHub Actions workflows
- ✅ Linting on push
- ✅ Tests on pull requests
- ✅ Auto-deploy on merge main
- ✅ Staging environment

**Implementazione**:
- Workflows: frontend-deploy.yml, backend-deploy.yml
- Actions: Lint → Test → Build → Deploy
- Secrets: GitHub Secrets per credentials

**Priorità**: P1  
**Complessità**: Alta

---

#### RNF.9.3 Deployment Strategy
**Descrizione**: Strategia deployment.

**Requisiti**:
- ✅ Zero-downtime deployments
- ✅ Rollback capability
- ✅ Blue-green deployments (opzionale)
- ✅ Automatic scaling
- ✅ Environment parity (dev/staging/prod)

**Implementazione**:
- Frontend: Vercel (automatic deployments)
- Backend: Railway (automatic deployments)
- Env vars: Separate per environment

**Priorità**: P1  
**Complessità**: Media

---

#### RNF.9.4 Logging & Observability
**Descrizione**: Centralized logging.

**Requisiti**:
- ✅ Structured logging (JSON)
- ✅ Log levels: DEBUG, INFO, WARNING, ERROR
- ✅ Timestamps: ISO 8601 format
- ✅ Request ID tracking: Correlation IDs
- ✅ Log retention: 30 giorni minimum

**Implementazione**:
- Frontend: Console logs + Sentry
- Backend: Python logging + Sentry
- Format: JSON for parsing

**Priorità**: P2  
**Complessità**: Media

---

---

## 🔐 Vincoli Tecnici

### VT.1 Stack Tecnologico Obbligatorio

| Componente | Tecnologia | Versione | Vincolo |
|-----------|-----------|---------|--------|
| Frontend | React | 18.0+ | Reattività, Component-based |
| Frontend | TypeScript | 5.0+ | Type safety |
| Frontend | Tailwind CSS | 3.0+ | Styling, responsive design |
| Backend | Python | 3.11+ | Runtime Python |
| Backend | FastAPI | 0.100+ | Framework async |
| Backend | Pydantic | 2.0+ | Data validation |
| Container | Docker | 20.0+ | Containerization |
| Hosting | Vercel | Latest | Frontend deployment |
| Hosting | Railway/Render | Latest | Backend deployment |

---

### VT.2 Browser Target Specifications

- **Minimum**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Target**: Latest 2 versions each browser
- **Mobile**: iOS Safari 14+, Chrome Android 90+

---

### VT.3 Performance Baselines

| Metrica | Target | Tool |
|---------|--------|------|
| First Contentful Paint | < 2s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| API Response Time | < 500ms | APM |
| JS Bundle Size | < 500KB (gzip) | Bundle Analyzer |
| Lighthouse Score | >= 80 | Lighthouse |

---

### VT.4 Data Specifications

| Elemento | Limite | Note |
|----------|--------|------|
| Max file size | 50MB | JSON report upload |
| Max vulnerabilities | 1000+ | Single report |
| Max assets | 500+ | Monitored assets |
| Retention period | 90 giorni | Report history |
| Concurrent users | 100+ | Simultaneous users |

---

---

## 📌 Assunzioni

### AS.1 User Behavior
- ✅ Utenti hanno conoscenza di sicurezza (professionisti)
- ✅ Useranno principalmente per analysis/decision-making
- ✅ Non useranno per editing/modification (read-only v1.0)
- ✅ Accedono principalmente da desktop/laptop

### AS.2 Data Availability
- ✅ Report JSON caricati via upload (no API integration v1.0)
- ✅ Dati statici per single report (no real-time sync v1.0)
- ✅ Backup responsabilità dell'utente
- ✅ No database persistente (in-memory v1.0)

### AS.3 Business Context
- ✅ Target: Security professionals at Essprimo S.r.l.
- ✅ No enterprise authentication required v1.0
- ✅ No compliance certifications required (GDPR awareness only)
- ✅ Competitive set: Datadog, New Relic, similar dashboards

### AS.4 Technical Environment
- ✅ Internet connectivity always available
- ✅ Modern browser with JavaScript enabled
- ✅ Sufficient disk space for file uploads (50MB)
- ✅ Network latency: < 200ms acceptable

---

---

## 🔗 Dipendenze

### DD.1 Esterne (Third-party)

| Dipendenza | Tipo | Versione | Note |
|-----------|------|---------|------|
| Recharts | NPM | 2.10+ | Charts library (React) |
| Zustand | NPM | 4.4+ | State management |
| Tailwind CSS | NPM | 3.3+ | Styling framework |
| Framer Motion | NPM | 10+ | Animation library |
| React Query | NPM | 4+ | Data fetching (opzionale v1.0) |
| FastAPI | PyPI | 0.100+ | Web framework |
| Pydantic | PyPI | 2.0+ | Data validation |
| Uvicorn | PyPI | 0.23+ | ASGI server |
| Docker | System | 20.0+ | Containerization |
| Node.js | System | 18.0+ | JavaScript runtime |
| Python | System | 3.11+ | Python runtime |

---

### DD.2 Interne (Module Dependencies)

```
frontend/
├── components/ → hooks/ → services/
├── services/ → types/
├── store/ → utils/
└── utils/ → constants/

backend/
├── routes/ → services/
├── services/ → models/
├── models/ → utils/
└── utils/ → constants/
```

---

### DD.3 Prerequisiti Development

- Git repository access
- GitHub account (for CI/CD)
- Vercel account (frontend deployment)
- Railway/Render account (backend deployment)
- Node.js + npm/yarn installed
- Python venv capability
- Docker installation
- Code editor (VS Code recommended)

---

---

## 📊 Matrice di Tracciabilità

### User Stories → Requisiti Funzionali

| User Story | RF | Priorità | Story Points |
|-----------|----|---------|--------------| 
| Come security engineer, voglio visualizzare dashboard completa | RF.2.1 | P0 | 13 |
| Voglio caricare il mio report JSON | RF.1.1 | P0 | 8 |
| Voglio filtrare vulnerabilità per severity | RF.4.1 | P0 | 6 |
| Voglio visualizzare tutte le vulnerabilità | RF.2.2 | P0 | 13 |
| Voglio cercare vulnerabilità | RF.4.5 | P1 | 10 |
| Voglio esportare il report in PDF | RF.5.1 | P1 | 13 |
| Voglio visualizzare trend storici | RF.7.1 | P2 | 10 |
| Voglio usare app in dark mode | RF.6.1 | P2 | 5 |

---

### Requisiti Non Funzionali → Test Cases

| RNF | Test Case | Metrica | Target |
|-----|-----------|---------|--------|
| RNF.2.1 | FCP timing | < 2s | ✅ Pass |
| RNF.2.1 | TTI timing | < 3.5s | ✅ Pass |
| RNF.2.2 | API latency | < 500ms | ✅ Pass |
| RNF.5.1 | Accessibility | WCAG AA | ✅ Pass |
| RNF.6.1 | Browser compat | Chrome, Firefox, Safari | ✅ Pass |
| RNF.7.2 | Test coverage | >= 80% | ✅ Pass |

---

## 📋 Checklist Implementazione

### Fase 1: Backend (Settimana 1)
- [ ] Setup progetto FastAPI
- [ ] Implementazione routes principali (reports, vulnerabilities)
- [ ] Pydantic models e validation
- [ ] Mock data service
- [ ] Docker containerization
- [ ] Tests backend
- [ ] API documentation (Swagger)

### Fase 2: Frontend Core (Settimana 1-2)
- [ ] Setup React + TypeScript + Tailwind
- [ ] Layout components (Header, Sidebar)
- [ ] Dashboard main view
- [ ] Summary cards
- [ ] Risk score gauge
- [ ] Vulnerability table
- [ ] Responsive design

### Fase 3: Features Interattive (Settimana 2)
- [ ] Filtri (severity, status, port, date)
- [ ] Smart search
- [ ] Grafici (Recharts)
- [ ] Heat maps
- [ ] Modal dettagli
- [ ] Dark mode
- [ ] Loading states

### Fase 4: Advanced Features (Settimana 3)
- [ ] Export PDF/CSV
- [ ] Trend analysis
- [ ] Certificati section
- [ ] Data leaks section
- [ ] Email security section
- [ ] WAF/CDN section
- [ ] Similar domains section

### Fase 5: Polish & Deployment (Settimana 3-4)
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Accessibility testing
- [ ] CI/CD setup
- [ ] Vercel deployment (frontend)
- [ ] Railway deployment (backend)
- [ ] Documentation finalization

---

## 📝 Allegati & Riferimenti

- **Allegato A**: User Personas
- **Allegato B**: Wireframes (opzionale)
- **Allegato C**: API Specification (OpenAPI/Swagger)
- **Allegato D**: Database Schema (se applicabile)
- **Allegato E**: Security Checklist

---

## 🔏 Documento di Approvazione

| Ruolo | Nome | Data | Firma |
|-------|------|------|-------|
| Project Manager | Essprimo S.r.l. | TBD | TBD |
| Technical Lead | Biagio Boccardi | TBD | TBD |
| Product Owner | Essprimo S.r.l. | TBD | TBD |

---

**Documento versione**: 1.0  
**Data creazione**: Marzo 2024  
**Ultimo aggiornamento**: Marzo 2024  
**Status**: DRAFT → APPROVED