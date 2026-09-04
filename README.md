# Docket — Case Tracker & Management Tool

A working MVP case tracker: case register, case detail with documents and
hearing history, a hearing calendar, and search/filter — built to be free to
run and easy to hand off or extend.

## What's included

- **Dashboard** — case counts by status + upcoming hearings
- **All cases** — searchable, filterable register of every case
- **Add a case** — form to log a new matter
- **Case detail** — view/edit case info, upload documents, see hearing history
- **Hearing calendar** — month view + list of every scheduled hearing

## Run it locally (free, no account needed)

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
cd case-tracker
npm install
npm run dev
```

Open http://localhost:3000 — three sample cases are pre-loaded so it's not
empty on first look.

## How data is stored

Case data lives in `data/db.json`, a plain JSON file on disk — that's what
makes this run with **zero external accounts or cost**. It's great for a demo
or a single-person pilot, but it is **not safe for multiple people using it
at the same time** (concurrent writes can overwrite each other), and on most
free hosting platforms the file resets on every deploy because the
filesystem isn't persistent.

**Before a real team pilot, swap this for a real database** — see below.

## Deploying for free (for a small pilot)

1. Push this folder to a GitHub repo.
2. Create a free [Supabase](https://supabase.com) project — gives you a
   hosted Postgres database, file storage, and auth all on one free tier.
3. Replace `lib/db.js` with calls to Supabase's client library instead of
   `fs.readFileSync`/`writeFileSync` (the function names — `getAllCases`,
   `createCase`, etc. — can stay the same, so the rest of the app doesn't
   need to change).
4. Deploy the frontend to [Vercel](https://vercel.com)'s free tier by
   importing the GitHub repo — it auto-detects Next.js.
5. Move file uploads from `public/uploads` to Supabase Storage, since
   Vercel's filesystem is also not persistent between deploys.

This keeps the whole pilot at ₹0/month on free tiers. See the build plan
document for the fuller roadmap (client portal, WhatsApp reminders, reports,
etc.) once the pilot proves the workflow.

## Project structure

```
app/
  page.js               Dashboard
  cases/page.js          Case register (list/search)
  cases/new/page.js      Add-a-case form
  cases/[id]/page.js     Case detail (view/edit/upload)
  calendar/page.js       Hearing calendar
  api/cases/...          API routes (GET/POST/PUT/DELETE)
lib/db.js                 Data layer — swap this file to change storage
data/db.json               Local JSON "database"
```
