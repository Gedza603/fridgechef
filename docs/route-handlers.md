Source: https://nextjs.org/docs/app/api-reference/file-conventions/route
Fetched: 2026-07-20 (Next.js docs, v16.2.10)

# Route Handlers (route.js)

> Route Handlers allow you to create custom request handlers for a given route using the
> Web Request and Response APIs.

```ts filename="route.ts"
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

## HTTP Methods

A route file allows you to create custom request handlers for a given route. The following
HTTP methods are supported: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`.

```ts filename="route.ts"
export async function GET(request: Request) {}
export async function POST(request: Request) {}
// ...
```

## Request Body

> You can read the Request body using the standard Web API methods:

```ts filename="app/items/route.ts"
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

## Segment Config Options

> Route Handlers use the same route segment configuration as pages and layouts.

```ts filename="app/items/route.ts"
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```

## How this applies to FridgeChef

`app/api/detect/route.ts` and `app/api/recipes/route.ts` are both Route Handlers following
this exact shape: a single exported `async function POST(req: Request)` that calls
`await req.json()` to read the request body (matching the "Request Body" example above),
and returns `NextResponse.json(...)` (Next.js's typed wrapper around the `Response.json()`
pattern shown here).

Both routes also set `export const runtime = "nodejs"` (from "Segment Config Options" above)
because the `openai` SDK needs the Node.js runtime rather than the Edge runtime.
