# Reflection

**What I built, and how I scoped it.** FridgeChef does one job: turn a photo of a fridge
or cupboard into recipes you can actually cook. Four screens cover the whole loop — home,
scan, scan detail, recipe detail — and nothing outside "photo → ingredients → recipes →
favourites" made it in. Worth naming honestly: the scope arrived as a fairly complete
spec upfront rather than something I narrowed down myself through iteration, so the "cut
it down to one thing" exercise didn't really happen here the way it's meant to.

**Persistence.** I chose `localStorage` over IndexedDB, cookies, and sessionStorage.
Cookies cap out around 4KB and were designed to travel with HTTP requests this app never
makes. sessionStorage dies with the tab, which fails the core requirement outright.
IndexedDB would handle many large photos better — native Blob storage, a much bigger
quota — but that headroom isn't needed for one person's occasional scans, and it trades a
one-line synchronous API for async boilerplate everywhere. `localStorage` matched how the
app actually reads (once, on mount) and writes (on discrete user actions), so simplicity
won.

**A technique that changed the outcome.** Writing `docs/route-handlers.md`, I fetched the
live nextjs.org/docs Route Handlers page instead of writing from memory, and pasted the
actual current examples in. That's what confirmed `app/api/detect` and `app/api/recipes`
were using the right shape — `async POST(request: Request)`, `await request.json()`,
`NextResponse.json()` — instead of me assuming a pattern that training data might have
gotten subtly stale on.

**Design pass.** I didn't run a separate, directed design pass — the emerald/rounded-card
look was set during the single initial build rather than iterated afterward with explicit
tone direction. That's a real gap against the intended workflow, not a stylistic choice.

**Harder than a plain-HTML app.** Client-side persistence in React fights you in ways
static HTML never does: `useEffect` calling `setState` to hydrate from `localStorage` on
mount trips ESLint's `set-state-in-effect` rule, and dynamic routes (`/scans/[id]`) need
`useParams()` instead of server-passed `params` since the data only exists in the
browser. None of that exists when a page is just HTML.

**Next time.** Keep: fetching real docs before writing code that depends on them. Change:
writing `CLAUDE.md` and committing per-feature from the start, not bolted on after the
whole app was already built in one pass.
