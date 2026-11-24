# PrepSpire AI
> **Tagline:** "Prepare Smarter. Speak Better. Get Interview Ready."

PrepSpire AI is an enterprise-grade, student-friendly SaaS platform designed for college students, freshers, and job seekers preparing for campus placements, technical interviews, HR screenings, coding rounds, communication tests, and group discussions.

---

## 1. Architecture & Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Analytics & Visualizations:** Recharts (Interactive Area & Bar Charts)
- **Gamification FX:** Canvas Confetti
- **Document Export:** jsPDF for instant client-side PDF reports, CSV export streaming

### Backend
- **Framework:** Python FastAPI
- **ORM & DB Engine:** SQLAlchemy 2.0 (PostgreSQL compatible, SQLite default for local development)
- **Validation:** Pydantic v2 & Pydantic Settings
- **Database Migrations:** Alembic
- **Security & Authentication:** Bcrypt password hashing & PyJWT token-based authentication
- **Speech & AI:**
  - Built-in heuristic evaluation engine (WPM, filler word detection, STAR method framing, technical keywords)
  - Optional Google Gemini API integration (server-side configured)
  - Optional local Ollama (Llama 3 / Mistral) integration
  - Web Speech API integration for speech recognition & speech synthesis

---

## 2. Database Models & Schema

The platform implements 22 relational models:
1. `User` — Authentication credentials, role status, account timestamps.
2. `UserProfile` — Student onboarding details, education, degree, target role, known/target skills.
3. `UserPreferences` — Theme, speech language, timer preferences, AI mode selection.
4. `Question` — 20,444 imported interview questions with keywords, roles, sectors, stages, categories, and levels.
5. `InterviewSession` — Mock interview simulator sessions with aggregate scores, strengths, weaknesses, and action plans.
6. `InterviewQuestion` — Questions linked to mock interviews with order indices, answers, and follow-up flags.
7. `AnswerAttempt` — User answer history with durations and input methods.
8. `AnswerEvaluation` — Criterion-wise scores (relevance, technical correctness, clarity, structure, terminology), filler count, WPM.
9. `CommunicationPrompt` — Curated speech prompts across 12 categories and 3 difficulty tiers.
10. `CommunicationSession` — Speech practice submissions with grammar, conciseness, and alternative expressions.
11. `JAMTopic` — Impromptu speaking topics across 12 diverse domains.
12. `JAMSession` — Just-A-Minute speech recordings with fluency, confidence, time management scores, and model outlines.
13. `AcademicQuestion` — Question bank covering 14 core computer science subjects.
14. `QuizAttempt` — Subject-wise quiz attempts with scoring and question-by-question breakdown.
15. `CodingChallenge` — Coding problems with constraints, sample test cases, starter code, and hints.
16. `CodingSubmission` — Coding submissions with execution mode tracking and algorithmic feedback.
17. `LearningPlan` — 30-day adaptive placement plan tracking baseline and current readiness scores.
18. `DailyPlanTask` — 150 daily curriculum tasks (5 tasks per day) across 4 preparation phases.
19. `Bookmark` — Saved questions, challenges, and prompts.
20. `Badge` — Gamification achievement badges.
21. `UserAchievement` — Unlocked user badges with timestamps.
22. `DatasetImport` — Audit record of imported CSV files, total rows, duplicates, and status.

---

## 3. Database Location & Initialization

- **Database File:** `backend/prepspire.db` (SQLite)
- **Initialization Command:**
  ```bash
  cd backend
  python -m app.db.init_db
  ```
- **Alembic Migrations:**
  ```bash
  cd backend
  alembic upgrade head
  ```

---

## 4. Dataset Integration (`interview_forge_v3_complete.csv`)

The platform integrates the real 27.7MB dataset:
- **Location:** `backend/data/interview_forge_v3_complete.csv`
- **Import Command:**
  ```bash
  cd backend
  python -m scripts.import_dataset
  ```
- **Import Results:**
  - **Total Rows Scanned:** 20,444
  - **Questions Imported:** 20,444
  - **Duplicates Detected on Re-run:** 20,444 (Idempotent)
  - **Invalid Rows:** 0

---

## 5. Startup Instructions

### Backend (FastAPI)
```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Documentation (Swagger): `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

### Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 6. Automated Tests

Run the test suite using pytest:
```bash
cd backend
pytest
```
**Test Results:**
- `9 passed in 4.27s`
- Verified: Database initialization, CSV validation, User registration/login, User data isolation, Mock interview creation & evaluation, Communication practice, JAM 30-day repetition cooldown, Academic quiz scoring, Coding practice submission, 30-Day plan persistence, and Report comparison.

---

## 7. Key Features Implemented

1. **User Authentication & Profiles:** Token-based secure authentication, diagnostic onboarding, and persistent profile storage.
2. **20,000+ Question Search:** Filter questions by target role, sector, interview stage, difficulty level, and keywords.
3. **AI Mock Interview Simulator:** Customizable interviews (HR, Technical, Behavioral, Mixed) with real-time answer evaluation, STAR method detection, filler word counters, contextual follow-up generation, and audio synthesis.
4. **Communication Practice:** 12 prompt categories with customizable prep (15/30/60s) and speaking (1/2/3m) timers, transcript capture, and vocabulary feedback.
5. **Just-A-Minute (JAM) Impromptu Speaking:** Automated timers (30s prep, 60s speech) with **backend-enforced 30-day topic cooldown and repetition prevention**.
6. **Academic Preparation (14 Subjects):** Curated quizzes for Java, DSA, OOP, DBMS, SQL, OS, Networks, Web Dev, Python, C/C++, AI, ML, Software Engineering, and Aptitude.
7. **Coding Practice Suite:** Multi-language workspace (Python, JavaScript, C++) with honest Practice-Mode labeling as required by security guidelines.
8. **Personalized 30-Day Placement Plan:** 4 phases (Foundation, Skill Development, Interview Application, Final Revision) containing 5 daily task types that adapt to user performance.
9. **Performance Reports & Session Comparison:** View all completed sessions, download instant **PDF feedback reports** and **CSV exports**, and compare any two sessions side-by-side with point deltas and persistent weakness tracking.
10. **Progress Analytics & Gamification:** Recharts weekly trend charts, active streak counters, XP, levels, and unlocked achievement badges.
11. **AI Career Coach:** Mentorship chat providing tailored daily practice recommendations and subject weakness analysis.
12. **Settings:** Switch between Offline Heuristics, Google Gemini API, and Local Ollama, adjust speech recognition language, and customize default timers.

---

## 8. Dynamic Interview Intelligence & Ollama Integration

PrepSpire AI v2.0 features full integration with local LLMs (via Ollama) alongside cloud LLMs (Google Gemini) and a deterministic offline evaluation engine.

### AI Providers Architecture
1. **Ollama (Local Private AI — Primary):** Runs completely offline on the user's machine with zero API costs and full data privacy.
   - Endpoint: `/api/chat` with complete multi-turn conversation history.
   - Recommended Model: `qwen2.5:7b` (or `qwen2.5-coder:3b`).
   - Dynamic Model Detection: Automatically discovers installed local Ollama models and falls back cleanly if a requested tag is missing.
2. **Google Gemini (Cloud AI — Alternative):** High-speed cloud reasoning via Gemini 1.5 Flash.
3. **Offline Evaluation Engine (Rule-based Fallback):** Natural language metrics (WPM, filler words, STAR method framing, keyword density) ensure zero downtime even when no LLM is running.

### Dynamic Question & Follow-Up Engine
- **Role-Aware Differentiation:** Distinct, specialized interview tracks for **Software Developer, Data Analyst, AI/ML Engineer, HR Specialist, Sales Executive, Business Operations, Frontend Developer, Backend Developer, and Python/Java Engineers**.
- **Adaptive Semantic Deduplication:** Jaccard similarity indexing (threshold 0.45-0.50) prevents the repetition of identical or semantically similar interview questions across rounds.
- **Intelligent Follow-Up Generation:** Evaluates the candidate's actual submitted answer to probe weak explanations, challenge assumptions, and request real-world examples.
- **Live Provider Health Monitoring:** Real-time provider status checks via `GET /api/v1/coach/providers/status` displayed directly in the Settings modal with model switching and latency handling.

### Ollama Setup Guide
1. **Download & Install Ollama:**
   Download from [ollama.com](https://ollama.com) (Windows, macOS, Linux).
2. **Pull the Recommended Model:**
   ```bash
   ollama pull qwen2.5:7b
   # Or for fast lightweight coding/technical reasoning:
   ollama pull qwen2.5-coder:3b
   ```
3. **Verify Ollama is Running:**
   ```bash
   ollama list
   # Ollama runs automatically on http://localhost:11434
   ```
4. **Configure in PrepSpire:**
   - In `backend/.env`: set `DEFAULT_EVALUATION_MODE=ollama` and `OLLAMA_MODEL=qwen2.5:7b` (or `qwen2.5-coder:3b`).
   - Alternatively, open the **Settings** modal in the live portal, select **Ollama (Local AI)**, and pick your active model.

