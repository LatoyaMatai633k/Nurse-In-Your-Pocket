# Nurse in Your Pocket

Nurse in Your Pocket is a South African digital health companion for women and young people. It includes health education, Nompilo AI conversations, symptom-preparation guidance, a period tracker, appointments, and a personal health profile.

## Technology

- React, TypeScript, Vite, and Tailwind CSS
- Netlify hosting and one Netlify Function
- OpenRouter Chat Completions for Nompilo AI
- Browser local storage for device-only preferences and records

There is no Supabase, Gemini, Render, Vercel, or separate backend service in this rebuild.

## Local setup

1. Install Node.js 20 or newer.
2. In `frontend`, run `npm install`.
3. Copy `.env.example` to `.env` in the project root and add your OpenRouter values.
4. Run `npx netlify dev` from the project root to test both the app and function together.

For frontend-only work, run `npm run dev` in `frontend`. AI requests require Netlify Dev because the secure function is not served by Vite.

## Environment variables

Set these in Netlify site settings and in your local `.env` file:

```text
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=your_selected_model
```

Never put these values in `frontend/.env`, source code, or a public repository.

## Deploy to Netlify

1. Push this `app` folder to a Git repository.
2. Create a new Netlify site from that repository.
3. Netlify reads `netlify.toml`: build command is `cd frontend && npm run build`, published folder is `frontend/dist`, and functions are in `netlify/functions`.
4. Add both environment variables in **Site configuration → Environment variables**.
5. Deploy.

## Privacy and offline behaviour

Health profiles, periods, appointments, and chat history are stored in the browser on the current device only. They are not shared between devices and can be cleared by clearing browser site data. This keeps the rebuild simple but is not a replacement for a shared, managed account system.

Saved pages and records remain available while offline. Nompilo needs an internet connection and reports an understandable offline message when one is unavailable.

## Testing

Run these from `frontend`:

```text
npm run lint
npm run build
```

Then use `npx netlify dev` from the project root and test sign-in, each navigation item, profile saving, period records, appointments, the language selector, responsive login layout, and AI requests. AI needs valid OpenRouter credentials to complete a live test.

## Project layout

```text
frontend/              React application
frontend/public/images Supplied logo and login image
netlify/functions/     Secure OpenRouter server function
netlify.toml           Netlify build and SPA routing configuration
```
