# Persistence decision

> Note on process: this write-up documents the reasoning behind a decision that was
> actually made during initial planning, but wasn't captured in writing until after the
> app was built. It's included here so the trade-offs are on record, even though the
> intended order (reflect first, then build) wasn't followed.

## The question

I'm building a small single-user app that runs only in my browser on my own machine.
There's no server, no database, and no login. I need whatever the user creates to still
be there after they close the tab and come back. What are my options, and which one fits
best?

## Options considered

**sessionStorage** — same API as localStorage, but cleared when the tab closes. Ruled out
immediately: it fails the core requirement (data must survive closing the tab).

**Cookies** — persist across sessions, but capped at ~4KB total per domain and were
designed to be sent with every HTTP request. FridgeChef stores fridge photos as base64
images, which can be hundreds of KB each — cookies aren't remotely large enough, and
since there's no server, the "sent with every request" behavior is just wasted overhead.

**localStorage** — a synchronous key-value store, strings only, roughly 5–10MB per
origin depending on the browser. Simple `getItem`/`setItem` API, no setup, works
identically in every browser.

**IndexedDB** — an asynchronous, transactional database in the browser. Much larger quota
(typically hundreds of MB to low GB, tied to available disk space), and it can store
binary data (`Blob`) natively instead of forcing everything through base64 text, which is
~33% more space-efficient for images. The trade-off is API complexity: every read/write
is asynchronous and event-based (or needs a wrapper library like `idb`) instead of a
one-line synchronous call.

**File System Access API** — lets the app save data as a real file the user picks on
disk. Rejected: inconsistent browser support (no Firefox support), and it asks the user
to manage files/folders directly, which doesn't fit a "just works" personal tool.

## Decision: localStorage

**Why it fits:** FridgeChef's data is small in both volume and shape — a handful of
scans (each one photo + a short ingredient list) and a handful of favourite recipes
(structured text, no binary data beyond the scan photos themselves). That's well within
localStorage's size limits for realistic personal use (occasional scans, not hundreds of
saved photos). The synchronous API also matched how the app is actually used: reads
happen once on page load to hydrate a React hook (`useScans`, `useRecipes`), and writes
happen on discrete user actions (save scan, delete recipe) — there's no need for
transactions, indexes, or background writes that would justify IndexedDB's complexity.

**The trade-off I'm accepting:** if someone saved a large number of high-resolution
photos, they could eventually hit localStorage's quota, and IndexedDB would handle that
better and more efficiently (native Blob storage vs. base64 bloat). For a small
single-user tool, that scale isn't the expected use case, so the simplicity of
`localStorage` (see `lib/storage.ts`) won out over the headroom of IndexedDB.
