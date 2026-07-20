# FridgeChef

Snap a photo of your fridge or cupboard and discover meals you can cook right now with what
you already have. No backend, no auth, no database — everything is stored in your browser's
`localStorage`.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then paste in your OpenAI API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI setup

Ingredient detection (`/api/detect`) and recipe generation (`/api/recipes`) are Next.js route
handlers that call the OpenAI Responses API server-side, so your API key is never exposed to
the browser. Without a key configured, the app still runs — the scan page will show a friendly
error with a "retry" option and a "add ingredients manually" fallback so you can use the rest
of the app end-to-end.

Set `OPENAI_API_KEY` in `.env.local` (see `.env.local.example`). Optionally override the models
with `OPENAI_VISION_MODEL` / `OPENAI_TEXT_MODEL` (both default to `gpt-4o-mini`).

## Tech

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- All data (scans, ingredients, favourite recipes) persisted to `localStorage` — see `lib/storage.ts`
- `hooks/useScans.ts` / `hooks/useRecipes.ts` wrap storage with React state
- `lib/ai.ts` (client) + `app/api/detect`, `app/api/recipes` (server) handle the AI calls
