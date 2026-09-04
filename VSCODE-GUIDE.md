# From Zero to a Live Litigation Dashboard — Step by Step

This guide assumes you've never used VS Code, GitHub, or deployed anything
before. Follow it top to bottom. Each step builds on the last — don't skip
ahead. Total time: roughly 1–2 hours spread over a few sittings.

Your dashboard (Docket) is already fully built and included in the
`case-tracker` folder. You are not writing it from scratch — you're learning
how to run it, tweak it, and put it on the internet.

---

## Part 1 — Install the three tools you need

You only do this once, ever.

1. **Node.js** (lets your computer run the app)
   Go to https://nodejs.org and download the **LTS** version. Run the
   installer, click Next through the defaults.

2. **VS Code** (where you'll view and edit the code)
   Go to https://code.visualstudio.com and download it. Install it like any
   normal program.

3. **Git** (lets you save your code to GitHub in Part 6)
   Go to https://git-scm.com/downloads, download, install with defaults.

**Check it worked:** Open VS Code. Click **Terminal → New Terminal** at the
top menu. A black/dark panel opens at the bottom — this is the terminal,
where you'll type commands throughout this guide. Type:

```
node -v
git -v
```

If both print a version number, you're set.

---

## Part 2 — Create a free GitHub account

Go to https://github.com and sign up (free). GitHub is where your code lives
online — think of it as Google Drive, but for code, and it's what connects
to the "make it live" service in Part 7.

---

## Part 3 — Open the project in VS Code

1. Unzip the `case-tracker.zip` file you downloaded from me, anywhere on
   your computer (e.g. your Desktop).
2. Open VS Code → **File → Open Folder** → select the unzipped `case-tracker`
   folder.
3. You'll see a file list on the left — this is your whole app.

Open the terminal again (**Terminal → New Terminal**) and type:

```
npm install
```

This downloads the building blocks the app needs. It takes a minute and
prints a lot of text — that's normal. Wait for it to finish.

---

## Part 4 — Run it on your own computer

In the same terminal, type:

```
npm run dev
```

You'll see a message like `Ready in 400ms`. Now open your web browser and
go to:

```
http://localhost:3000
```

**Your dashboard is running.** Right now it only you can see it, on your own
computer — that's what "local" means. Click around: add a case, open the
calendar, search. This is the exact same app your manager would see later,
just not on the internet yet.

To stop it, click into the terminal and press `Ctrl + C`.

---

## Part 5 — Make your first edit (builds confidence)

This step is optional but worth doing once — it proves you can change things
without breaking them.

1. In VS Code's file list, open `app/layout.js`.
2. Find this line:
   ```
   <span className="brand-mark">§</span> Docket
   ```
3. Change `Docket` to your firm's name, e.g. `Mehta & Associates`.
4. Save the file (`Ctrl + S`).
5. If `npm run dev` is still running, switch to your browser and refresh —
   your change appears instantly. If it's stopped, run `npm run dev` again.

That's the whole editing loop: **open a file → change text → save → refresh
browser.** Everything else you'll ever do follows this same pattern.

---

## Part 6 — Save your code to GitHub

This backs up your code and is required before Part 7.

1. In VS Code, click the **Source Control** icon on the left sidebar (looks
   like a branching line).
2. Click **Publish to GitHub**. VS Code will ask you to sign in to GitHub —
   do that.
3. Choose **Publish to GitHub private repository** (keep it private — it's
   your firm's tool).
4. VS Code uploads everything. Done — no typed git commands needed.

From now on, whenever you make changes: come back to this Source Control
panel, type a short message describing what changed (e.g. "added client
notes field"), click the checkmark to **Commit**, then click **Sync
Changes** to push it to GitHub.

---

## Part 7 — Make it live on the internet

We'll use **Vercel** — built specifically for apps like this, free tier is
generous, and it connects directly to GitHub.

1. Go to https://vercel.com and **sign up using your GitHub account** (one
   click, no new password needed).
2. Click **Add New → Project**.
3. Find your `case-tracker` repository in the list and click **Import**.
4. Leave all the settings on default — Vercel automatically detects it's a
   Next.js app.
5. Click **Deploy**. Wait about a minute.
6. You'll get a real URL like `case-tracker-yourname.vercel.app` — **this is
   your live dashboard.** Anyone with the link can open it, from any device.

**Important — read this before you rely on it:** the version you just
deployed stores case data in a plain file, and Vercel's servers don't keep
files permanently — they can reset when you redeploy. It's perfectly fine
for **showing your manager a live demo**. For real day-to-day use with data
that must not disappear, do Part 8 next — it's the single most important
upgrade and only takes about 15 minutes.

---

## Part 8 — Make your data permanent (free, ~15 minutes)

Right now your dashboard is like a whiteboard — great for showing people,
but wipeable. This step gives it a real, permanent, free database.

1. Go to https://supabase.com, sign up free, click **New Project**. Pick any
   name and password (save the password somewhere), pick a region close to
   you, click **Create**. Wait ~2 minutes while it sets up.

2. In your new Supabase project, click **SQL Editor** in the left sidebar →
   **New query**. Open the file `supabase-setup/schema.sql` from your
   project folder in VS Code, copy all of it, paste it into Supabase, and
   click **Run**. This creates your `cases` table with a couple of sample
   cases already in it.

3. In Supabase, click **Project Settings → API**. You'll see a **Project
   URL** and an **anon public** key. Keep this tab open.

4. Back in VS Code:
   - Copy `supabase-setup/.env.local.example` and rename the copy to
     `.env.local` (put it in the main project folder, next to
     `package.json`).
   - Open `.env.local` and paste in your Project URL and anon key from
     Supabase.
   - In the terminal, run:
     ```
     npm install @supabase/supabase-js
     ```
   - Copy `supabase-setup/supabaseClient.js` into the `lib/` folder.
   - Replace `lib/db.js` with `supabase-setup/db.supabase.js` — easiest way:
     delete the old `lib/db.js`, then copy `db.supabase.js` into `lib/` and
     rename it to `db.js`.

5. Run `npm run dev` again and check `http://localhost:3000` still works —
   now every case you add is actually saved in Supabase, permanently.

6. Commit and push this change (Part 6's steps), then in Vercel: go to your
   project → **Settings → Environment Variables** → add the same two values
   from your `.env.local` file → **Save** → go to **Deployments** and
   redeploy. Your live URL now has permanent storage too.

---

## What you've actually learned

- How to run a real web app on your own machine
- How to safely change code and see the result
- How version control (GitHub) backs up and tracks your work
- How to deploy an app so it has a real internet address
- How to connect an app to a real database

This is genuinely most of what a junior developer does day-to-day. You now
know the loop — the rest is learning more pieces to plug into it.

## If something breaks

Copy the exact error message from the terminal or browser and send it to
me — I'll tell you exactly what it means and how to fix it. Don't worry
about "breaking" anything; everything here is backed up in GitHub once
you've done Part 6, so you can never really lose your work.
