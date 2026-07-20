# Reflection

**What I built and how I scoped it down**
I built FridgeChef, an app where you take a picture of your fridge and it tells you what
you can cook with what's in there. It's basically 4 pages: home, the scan page, a page
for each scan, and a page for each saved recipe. That's it, I didn't add extra stuff.
Honestly though, I didn't really "scope it down" myself since I already had a pretty
detailed plan for what I wanted before I started, so I kind of skipped that step of
narrowing it down.

**Persistence decision**
I went with localStorage instead of IndexedDB, cookies, or sessionStorage. Cookies are
way too small (like 4KB) and are meant for sending to a server anyway, which this app
doesn't have. sessionStorage deletes everything when you close the tab, which is
literally the opposite of what I need. IndexedDB is more powerful and can hold way more
data, but it's a lot more complicated to use (everything's async) and I don't need that
much storage for just a few scans and recipes. localStorage was simple and did exactly
what I needed.

**A moment that actually mattered**
When I was writing the docs file about Next.js route handlers, instead of just writing
what I thought I remembered about them, I actually pulled the real docs from nextjs.org
and used the real code examples. That's how I found out my API routes were set up the
right way (using `request.json()` and `NextResponse.json()`) instead of just guessing and
hoping it was right.

**Design pass**
Ngl I didn't really do a separate design pass. The green rounded-card look just kind of
happened while I was building everything else instead of me going back and intentionally
redoing the style.

**What was harder than the plain HTML site**
Way harder than plain HTML because now stuff has to "remember" things after you close the
tab, so I had to deal with hydration issues (like ESLint complaining about setting state
inside useEffect) and dynamic routes needing `useParams()` instead of just getting the id
handed to you. None of that is a problem when it's just a static HTML page.

**What I'd do differently next time**
I'd actually look up real docs before writing code that depends on them, like I did with
the route handlers thing. I'd also make CLAUDE.md and commit after each feature from the
start instead of building the whole thing in one big go and adding that stuff after the
fact.
