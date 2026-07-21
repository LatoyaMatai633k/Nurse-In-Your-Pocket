# Nurse in Your Pocket API

FastAPI service layer for Nurse in Your Pocket. It provides authenticated core-MVP endpoints for Nompilo chat history, symptom summaries, health profiles, period records, and appointments.

## Run locally

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The health check is available at `GET /api/v1/health`.

## Supabase database

Run `supabase/migrations/001_core_mvp.sql` in the Supabase SQL editor (or through the Supabase CLI) before using the MVP data APIs. Keep the service-role key in the backend `.env` only; it must never be added to the frontend environment.
