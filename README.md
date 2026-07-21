# Nurse in Your Pocket

Nurse in Your Pocket is an AI-powered personal health companion designed primarily for young women in South Africa. It provides trustworthy health education, help preparing for clinic visits, and tools that make healthcare easier to navigate. It supports and never replaces qualified healthcare professionals.

## Problem statement

Many young women face barriers to understandable health information, prepared clinic conversations, and consistent personal health organisation. Connectivity, time, and uncertainty can make these barriers harder.

## Solution

A warm, accessible mobile-first companion that brings health education, care preparation, appointment organisation, and future AI guidance into one private space.

## Milestone 1 features

- React, Vite, TypeScript, Tailwind CSS frontend
- Reusable healthcare design system and responsive navigation shell
- Supabase-ready email, password reset, and Google authentication flow
- Protected dashboard routes and session management
- Dashboard placeholders for Nompilo, symptom checking, period tracking, library, appointments, health profile, and settings
- FastAPI API foundation with configuration, versioned routes, and future service boundaries

## Architecture

```
frontend/  React client, UI system, Supabase browser auth
backend/   FastAPI API, configuration, services, schemas
```

The frontend communicates with Supabase Auth directly. Future healthcare data and Nompilo capabilities will be exposed by the FastAPI service layer and persisted through Supabase PostgreSQL.

## Installation

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/.env`. In Supabase Auth, enable Email and Google providers, and add your local and production callback URLs.

### Backend

```bash
cd backend
copy .env.example .env
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Screenshots

_Screenshots will be added as the application feature set is completed._

## Future roadmap

- Nompilo AI health education and clinic-preparation conversations
- Symptom guidance with safety escalation
- Period tracking, appointments, and personal health profile
- Offline health library and four-language support
- Voice, medication scanning, reminders, and health integrations

## License

This project is licensed under the MIT License.
