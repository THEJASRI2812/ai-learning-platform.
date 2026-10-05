# AI-POWERED PERSONALIZED LEARNING & SKILL DEVELOPMENT PLATFORM

> **"Personalized Learning • Continuous Improvement • Future-Ready Skills"**

A comprehensive, production-grade EdTech web application prototype engineered with a **pure HTML5 / CSS3 / Vanilla JavaScript** frontend, a scalable **Node.js & Express REST API** backend, **Supabase PostgreSQL & Authentication**, and **Google Gemini AI**.

---

## 1. Project Overview

Traditional education applies a rigid one-size-fits-all model that frequently fails to detect granular prerequisite gaps until students fail exams. This platform demonstrates a closed-loop adaptive learning architecture:

```
DATA COLLECTION
       ↓
AI LEARNING ENGINE (Google Gemini + Analytics)
       ↓
PERSONALIZED OUTPUTS
       ↓
STUDENT DASHBOARD   →   TEACHER PANEL   →   INSTITUTION ANALYTICS
       ↓                      ↓                     ↓
       └──────────────────────┴─────────────────────┘
                              ↓
                  CENTRALIZED POSTGRESQL (Supabase)
```

### Core Value Pillars:
- **Zero Frontend Build Tool Requirement**: Runs straight out of the box in VS Code via Live Server (`http://127.0.0.1:5500`).
- **Resilient Multi-Mode Integration**: Includes an intelligent mock/live fallback engine in `frontend/js/api.js` ensuring that all 20 pages, charts, assessments, and AI flows are immediately demonstrable even before API keys are configured.
- **Role-Based Access Control**: Tailored workflows for **Students**, **Teachers**, and **Institution Administrators**.

---

## 2. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | **Strictly NO** React, Vite, Angular, Vue, Tailwind, or Bootstrap. |
| **Icons & Visuals** | Lucide Icons CDN | Scalable SVG icons initialized via CDN. |
| **Data Visualizations** | Chart.js CDN | Line, Bar, Doughnut, and Radar charts. |
| **Backend API** | Node.js & Express.js | Modular REST endpoints with configurable CORS. |
| **Database & Auth** | Supabase PostgreSQL & Auth | 16 Relational tables with Row Level Security (RLS). |
| **Artificial Intelligence** | Google Gemini API (2.5 / 1.5) | Socratic AI Tutor, Gap Detection, and Career Recommendation. |

---

## 3. Directory & Folder Structure

```
ai-learning-platform/
├── database/
│   ├── schema.sql              # Complete PostgreSQL schema (16 tables + RLS policies)
│   └── seed.sql                # Seed data for courses, modules, skills, questions, badges
├── backend/
│   ├── package.json            # Node dependencies (Express, CORS, Supabase, Google GenAI)
│   ├── server.js               # Express application entry point & CORS configuration
│   ├── .env                    # Active local environment variables
│   ├── .env.example            # Environment template
│   ├── middleware/
│   │   └── authMiddleware.js   # Supabase JWT token verification & role authorization
│   ├── services/
│   │   ├── aiService.js        # Gemini API integration & structured JSON handlers
│   │   └── supabaseService.js  # Supabase client singleton with error recovery
│   └── routes/
│       ├── auth.js             # User profile synchronization & session verification
│       ├── students.js         # Student profile, progress KPIs, and onboarding
│       ├── courses.js          # Course catalogs and module roadmaps
│       ├── assessments.js      # Adaptive diagnostic testing and scoring
│       ├── skills.js           # 10-category skill catalog & benchmarks
│       ├── ai.js               # AI Tutor, performance analysis, skill-gap & career endpoints
│       ├── teacher.js          # Faculty student roster, notes, and at-risk detection
│       └── institution.js      # Dean analytics, department metrics, and export reports
├── frontend/
│   ├── index.html              # 11-section landing page with architectural data flow
│   ├── login.html              # Multi-role login with 1-click demo buttons
│   ├── register.html           # Full registration with role routing
│   ├── onboarding.html         # 6-step animated onboarding wizard
│   ├── student-dashboard.html  # Student overview with 6 KPI cards & 3 Chart.js graphs
│   ├── ai-tutor.html           # Socratic chat interface with prompt chips & practice quizzes
│   ├── learning-path.html      # Visual milestone roadmap (Python Basics → ML Project)
│   ├── assessments.html        # Adaptive diagnostic quiz runner with timer & score breakdown
│   ├── skills.html             # Skill gap meters (Current vs. Required) across 10 categories
│   ├── progress.html           # Progress tracking with 4 charts (Line, Bar, Donut, Radar)
│   ├── achievements.html       # Gamified milestone badges with celebration statuses
│   ├── career.html             # 7 Future-ready career cards with alignment match scores
│   ├── profile.html            # Student profile view and preferences editor
│   ├── teacher-dashboard.html  # Faculty panel with class metrics and student table
│   ├── teacher-students.html   # Cohort management roster with live search filtering
│   ├── student-details.html    # Deep-dive individual performance dossier & teacher notes
│   ├── risk-analysis.html      # At-risk detection with measurable indicators & disclaimer
│   ├── institution-dashboard.html # Executive institution KPI cards & department bars
│   ├── institution-analytics.html # Macro analytics with enrollment trends & skill radar
│   ├── reports.html            # Accreditation and compliance report export center
│   ├── css/
│   │   ├── style.css           # Global theme variables, reset, typography, landing layout
│   │   ├── auth.css            # Auth cards, role selector tabs, 6-step wizard
│   │   ├── dashboard.css       # App sidebar shell, topbar, KPI cards, charts, data tables
│   │   ├── components.css      # Toasts, modals, chat bubbles, quiz tiles, skill meters
│   │   └── responsive.css      # Mobile drawer menu, tablet breakpoints, scrollable tables
│   └── js/
│       ├── config.js           # Supabase URL/key and backend API base URL
│       ├── utils.js            # Toast notifications, modal helpers, and Lucide refresher
│       ├── api.js              # Centralized fetch wrapper with automatic demo fallback
│       ├── auth.js             # Supabase Auth client wrapper & route guards
│       ├── charts.js           # Chart.js helper for Line, Bar, Doughnut, and Radar charts
│       ├── main.js             # Landing page interactions & contact form handler
│       ├── dashboard.js        # Student KPI cards & chart renderers
│       ├── ai-tutor.js         # AI Tutor chat runner with Gemini prompt actions
│       ├── learning-path.js    # Visual roadmap node renderer
│       ├── assessments.js      # Diagnostic question runner, scoring, & recommendations
│       ├── skills.js           # Skill gap calculations and catalog filter
│       ├── progress.js         # Progress page multi-chart builder
│       ├── career.js           # Career recommendation cards generator
│       ├── teacher.js          # Faculty metrics, at-risk analysis, & note saving
│       └── institution.js      # Macro institution analytics & report simulation
└── README.md
```

---

## 4. Setup & Running Instructions

### Step 1: Frontend Setup (VS Code Live Server)
The frontend requires **no Node packages or build steps**.
1. Open the folder `ai-learning-platform` in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click on `frontend/index.html` and choose **"Open with Live Server"**.
4. Your browser will launch:
   ```
   http://127.0.0.1:5500/frontend/index.html
   ```

### Step 2: Backend Setup (Node.js & Express)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
4. The backend will be active at:
   ```
   http://localhost:5000
   ```
   You can verify it via the health check: `http://localhost:5000/api/health`.

---

## 5. Supabase Database & Auth Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `database/schema.sql`, copy all contents, paste into the SQL editor, and click **Run**.
4. Open `database/seed.sql`, copy all contents, paste into the SQL editor, and click **Run**.
5. Retrieve your project credentials from **Project Settings → API**:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`
6. Update credentials:
   - In `frontend/js/config.js`:
     ```javascript
     const SUPABASE_URL = "https://your-project.supabase.co";
     const SUPABASE_ANON_KEY = "your-anon-public-key";
     ```
   - In `backend/.env`:
     ```env
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-public-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
     ```

---

## 6. Google Gemini AI Setup

1. Generate a free API key at [ai.google.dev](https://ai.google.dev/).
2. Open `backend/.env` and paste your key:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   ```
3. Restart the backend:
   ```bash
   npm start
   ```
> **Security Note**: The Gemini API key remains strictly isolated on the Express backend and is **never** sent or exposed to client browsers.

---

## 7. Interactive Demo Testing Flow

For immediate evaluation, pitching contests, or university reviews, you can test every workflow right away using the built-in 1-click accounts on `login.html`:

| Role | Demo Email | Target Destination | Key Features to Test |
|---|---|---|---|
| **Student** | `student@edulearn.ai` | `student-dashboard.html` | AI Socratic Tutor, 10-Question Diagnostic, Skill Gaps, Career Alignment |
| **Teacher** | `teacher@edulearn.ai` | `teacher-dashboard.html` | Student Roster, At-Risk Diagnostic Flags, Intervention Notes |
| **Admin** | `admin@edulearn.ai` | `institution-dashboard.html` | Department GPA Comparison, Radar Skill Spread, PDF/CSV Export |

---

## 8. Backend API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Server status and platform version |
| `/api/auth/sync-profile` | POST | Sync Supabase authenticated user to profiles table |
| `/api/students/:id` | GET | Retrieve student profile, enrollments, and KPIs |
| `/api/students/:id/progress` | GET | Learning streak, weekly hours, and chart data |
| `/api/students/:id/skills` | GET | Current skills, benchmark levels, and gap % |
| `/api/students/:id/onboarding` | PUT | Save 6-step onboarding wizard choices |
| `/api/courses` | GET | Catalog of courses and sequential modules |
| `/api/skills` | GET | 10-category skill catalog with projects & certificates |
| `/api/assessments` | GET | 10-question adaptive assessment runner |
| `/api/assessments/submit` | POST | Evaluates answers, calculates weak topics, and suggests remedies |
| `/api/ai/tutor` | POST | Socratic AI Tutor via Gemini (Simple, Example, Hint, Quiz) |
| `/api/ai/analyze` | POST | Cognitive performance analysis of student study habits |
| `/api/ai/skill-gap` | POST | Computes skill gaps against industry role benchmarks |
| `/api/ai/career` | POST | AI career alignment matching for 7 engineering disciplines |
| `/api/teacher/students` | GET | Class roster with progress, scores, and status |
| `/api/teacher/risk-analysis` | GET | Measurable at-risk student telemetry with suggested support |
| `/api/teacher/notes` | POST | Record faculty mentorship observation |
| `/api/institution/analytics` | GET | Executive macro KPIs and departmental analytics |
| `/api/institution/reports` | GET | Accreditation and curriculum effectiveness reports |

---

## 9. Compliance & Ethical AI Disclaimers

- **At-Risk Analysis (`risk-analysis.html`)**: Presented strictly as an early pedagogical indicator based on measurable activity (low quiz scores, inactivity). It is designed to assist faculty mentoring and is never presented as a deterministic prediction of a student's capabilities.
- **Career Recommendations (`career.html`)**: Projections represent educational guidance based on available module completion data, not guaranteed professional outcomes.
