# MeetFlow - Fireflies.ai Inspired Meeting Workspace & Transcription App

MeetFlow is a full-stack meeting transcription and assistant workspace application built with **FastAPI**, **SQLAlchemy**, **SQLite**, and **Next.js (App Router)** with **TypeScript** and **Tailwind CSS**.

It recreates the core Fireflies.ai user experience, featuring an interactive media player synchronized with meeting transcripts, AI summaries, chapter topics, action item management with full CRUD, search & filtering, meeting management, and automated database seeding.

---

## Key Features

- 🎯 **Fireflies-Inspired Dashboard**: Clean workspace layout with meetings list/cards, attendee avatars, duration, and status indicators.
- ⚡ **Full-Text & Participant Search**: Search meetings by title or attendee names; filter by specific participants; sort by newest, oldest, or duration.
- 🎵 **Synchronized Media Player**: Real-time simulated audio player synchronized with transcript lines.
  - Click any transcript segment timestamp to seek media player position instantly.
  - Playing the media player automatically highlights the active spoken segment and auto-scrolls it into view.
- 🔍 **In-Transcript Search**: Client-side instant keyword search within transcript text with match counters (`Match X of Y`) and next/previous match navigation.
- 🤖 **AI Summaries & Chapters**: Overview bullet points, key takeaways, and key topic chapters with clickable timestamps.
- ✅ **Action Items CRUD**: Interactive checklist allowing users to add, edit, delete, and toggle completion status for action items with immediate SQLite persistence.
- ➕ **Create & Import Meetings**: Form supporting raw pasted transcript text parsing (`[MM:SS] Speaker: Text`) into segment sequences.
- ✏️ **Edit & Delete Meetings**: Update metadata or delete meetings with confirmation modals and relational SQLite cascade deletion.
- ⚙️ **Settings Workspace**: Placeholder configuration page for profile, notifications, appearance, and integration cards (*Zoom*, *Google Meet*, *Slack*, *Teams*).
- 📦 **Export Options**: Export transcripts as plain text (`.txt`) and summaries as Markdown (`.md`).

---

## Tech Stack

### Backend
- **Framework**: Python 3.11 + FastAPI
- **ORM**: SQLAlchemy 2.0
- **Database**: SQLite (`meetflow.db`)
- **Data Validation**: Pydantic v2
- **Server**: Uvicorn

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Centralized Fetch API Client (`lib/api.ts`)

---

## Architecture & Directory Structure

```
meetflow/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app initialization, CORS, health & startup
│   │   ├── database.py        # SQLAlchemy engine, SQLite pragma configuration
│   │   ├── models.py          # SQLAlchemy ORM models & CASCADE relationships
│   │   ├── schemas.py         # Pydantic validation schemas
│   │   ├── seed.py            # Seed script populating 6 realistic meetings
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── meetings.py     # GET, POST, PUT, DELETE /meetings
│   │       ├── transcript.py   # GET /meetings/{id}/transcript
│   │       ├── action_items.py # POST, PUT, DELETE /action-items
│   │       └── topics.py       # GET /meetings/{id}/topics
│   ├── requirements.txt
│   └── meetflow.db            # SQLite database file
├── frontend/
│   ├── app/
│   │   ├── globals.css        # Tailwind directives & theme styles
│   │   ├── layout.tsx         # Root layout with sidebar & toast provider
│   │   ├── page.tsx           # Meetings Dashboard with search & stats
│   │   ├── meetings/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Detailed Workspace (Player, Transcript, Summary, Action Items)
│   │   └── settings/
│   │       └── page.tsx       # Settings placeholder page
│   ├── components/
│   │   ├── layout/            # Sidebar, Header
│   │   ├── meetings/          # MeetingCard, MeetingFilters, Create/Edit/Delete Modals
│   │   ├── transcript/        # Transcript, TranscriptSegment, TranscriptSearch
│   │   ├── player/            # MeetingPlayer with audio sync logic
│   │   ├── summary/           # SummaryPanel, TopicList, ActionItems CRUD
│   │   └── ui/                # Button, Modal, Badge, Toast, LoadingSkeleton
│   ├── lib/
│   │   ├── api.ts             # Centralized API layer for FastAPI
│   │   ├── types.ts           # Shared TypeScript interfaces
│   │   └── utils.ts           # Time formatters, initials, avatar colors
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.local             # NEXT_PUBLIC_API_URL=http://localhost:8000
├── README.md
└── .gitignore
```

---

## Database Schema (SQLite)

- **meetings**: `id` (UUID), `title`, `meeting_date`, `duration`, `summary`, `created_at`, `updated_at`
- **participants**: `id`, `meeting_id` (FK cascade), `name`, `email`
- **transcript_segments**: `id`, `meeting_id` (FK cascade), `speaker`, `timestamp_seconds`, `text`, `sequence_number`
- **action_items**: `id`, `meeting_id` (FK cascade), `task`, `assignee`, `due_date`, `completed`, `created_at`, `updated_at`
- **topics**: `id`, `meeting_id` (FK cascade), `title`, `description`, `start_time`

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Backend status check |
| `GET` | `/meetings` | List meetings with query `q`, `participant` filter, `sort_by` |
| `GET` | `/meetings/{id}` | Get meeting details with nested transcript, topics & action items |
| `POST` | `/meetings` | Create meeting & parse raw transcript text |
| `PUT` | `/meetings/{id}` | Update title, date, duration, summary, participants |
| `DELETE` | `/meetings/{id}` | Delete meeting & cascaded records |
| `GET` | `/meetings/{id}/transcript` | Get transcript segments ordered by sequence_number |
| `POST` | `/meetings/{id}/action-items` | Add new action item to meeting |
| `PUT` | `/action-items/{id}` | Update task, assignee, due date, or toggle completed status |
| `DELETE` | `/action-items/{id}` | Delete action item |
| `GET` | `/meetings/{id}/topics` | Get key topics/chapters for meeting |

---

## Setup & Local Run Instructions

### 1. Backend Setup (FastAPI & SQLite)

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Seed SQLite database with 6 realistic meetings
python -m app.seed

# Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will be accessible at: `http://localhost:8000` (Docs: `http://localhost:8000/docs`)

### 2. Frontend Setup (Next.js & Tailwind CSS)

```bash
cd frontend

# Install Node dependencies
npm install

# Run dev server
npm run dev
```
Frontend Web Application will be accessible at: `http://localhost:3000`

---

## Assumptions & Scope Notes

- **Real Speech Recognition**: Out of scope per specification. Transcript segments are stored in SQLite and synchronized with a simulated timeline player.
- **Authentication**: Default logged-in user (`John Doe`) is assumed.
- **Integrations**: Integrations tab displays "Coming Soon" badges for Zoom, Google Meet, Slack, and Teams.
