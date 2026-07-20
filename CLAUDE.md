# FridgeChef

A single-user, browser-only app: photograph your fridge/cupboard, let AI list the
ingredients, then generate recipes from them. No backend, no auth, no database.

## Persistence

All data (scans, ingredients, favourite recipes, notes) lives in `localStorage`.
See `REFLECTION.md` for why localStorage was chosen over alternatives.

- `lib/storage.ts` — raw localStorage read/write, one function per entity per operation
- `hooks/useScans.ts`, `hooks/useRecipes.ts` — React state wrappers around `lib/storage.ts`;
  pages should use these hooks, not `lib/storage.ts` directly

## AI

`OPENAI_API_KEY` must be set in `.env.local` (see `.env.local.example`). The key is
**server-only** — never call OpenAI from a client component.

- `lib/ai.ts` — client-side fetch wrappers, call these from pages
- `app/api/detect/route.ts` — vision call, photo → ingredient list
- `app/api/recipes/route.ts` — text call, ingredient list → recipe suggestions
- Both use the Responses API with a `json_schema` response format for guaranteed-parseable output
- On failure, routes return `{ error: string }` with a non-2xx status; `lib/ai.ts` throws
  that message so pages can show it and offer retry/manual-entry fallback

## Structure

```
app/            pages (App Router) + api/ route handlers
components/     shared UI, all presentational except where noted "use client"
hooks/          useScans, useRecipes — the only way pages should touch storage
lib/            storage.ts (localStorage), ai.ts (client AI calls), openai-server.ts (server AI client)
types/          Scan, Recipe, GeneratedRecipe
docs/           cited framework reference material
```

## Conventions

- Every page that reads/writes app data is a client component (`"use client"`) — there is
  no server-side data source to render from.
- Dynamic route pages (`/scans/[id]`, `/recipes/[id]`) read the id via `useParams()`, not
  server-passed `params`, since the data they need only exists in the browser.
- Tailwind v4, CSS-first config (no `tailwind.config.js`) — theme tokens live in `app/globals.css`.

## Commands

- `npm run dev` — start locally
- `npm run build` / `npm run lint` — must both pass clean before committing
