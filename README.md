# Macro Tracker

A single-page macro logger with stats, editable targets, and phase tracking. The UI is one static HTML file with no build step; a small Vercel serverless function persists your data to a Neon Postgres database so it syncs across every device you open the app on.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app. Reads/writes through `api/state.js`, with a localStorage copy kept as an offline cache. |
| `api/state.js` | Vercel serverless function. `GET` returns the current entries/phases/favorites/hidden-days/weights; `POST { key, value }` upserts one of them into Neon. |
| `package.json` | Declares the `@neondatabase/serverless` dependency the API route uses. |
| `macro_data.csv` | Historical daily macros exported from the Google Sheet, embedded in `index.html` as seed data (always shipped with the app, independent of the database). |

## Tabs

**log** — Add foods for any day. Gauges show each macro against the day's targets with how much is left to go. Save anything as a favorite for one-tap re-adding. Edit or delete any entry, including imported day totals. Jump to any date, or copy the previous day forward.

**stats** — Filter by time window (7/14/30/all) or by phase. Hit rates per macro, a switchable chart for each macro with target bands drawn in, a day grid you can tap to jump to that day, streaks, day-of-week averages, weekly table, and written takeaways that recompute from whatever's filtered.

**weight** — Log a daily weigh-in (lb); logging the same date again overwrites it. Shows your latest weight, 7-day average, change versus a week ago and since the current phase began. Two graphs: weight over time (daily dots plus a 7-day average line, with phase changes marked, filterable to 30/90 days/all time) and week-over-week change in average weight, with that week's average calories on each bar. It also shows your weekly trend and a rough maintenance-calorie estimate from your logged intake versus your scale trend.

**phases** — Define your own training phases. Each has a name, a start date, and four target ranges, and runs until the next phase begins, so past days keep being scored against the goals you actually had then. Scale a phase's targets by a percentage, duplicate one, or delete it.

**data** — Export all daily totals as CSV or copy to clipboard. Paste rows in to bulk-import. Reset everything back to the original sheet history.

## Default phases

These ship with the app and are fully editable on the phases tab.

| Phase | Starts | Calories | Protein | Carbs | Fat |
|---|---|---|---|---|---|
| Cut | Aug 12, 2026 | 1800–2000 | 150–180g | 155–185g | 60–70g |
| Maintain | Aug 31, 2026 | 2400–2700 | 170–200g | 250–300g | 70–85g |

To start a bulk, add a phase dated the day you want it to begin and set its ranges — everything before that date keeps its old scoring.

## Storage

Entries, favorites, phases, weigh-ins, and hidden-day overrides live in a shared Neon Postgres database (one row per key, in a `kv_store` table the API creates automatically on first use). Every device that opens the app sees and writes the same data — there's no per-user login, so **anyone with the URL can read and edit it**. Keep the deployment URL private if that matters to you. A local copy is also cached in each browser's localStorage so the log tab still works offline and repaints instantly before the server round-trip finishes.

Use the CSV export on the data tab to back up your data or to refresh `macro_data.csv` in this repo.

## Deploying to Vercel + Neon

The app needs a real server for `api/state.js`, so this replaces GitHub Pages (which only serves static files).

1. **Get a database.** In your Vercel project (after step 2) open the **Storage** tab → **Create Database** → **Neon** (Postgres), or create a project directly at [neon.tech](https://neon.tech) and copy its connection string.
2. **Import the repo into Vercel.** [vercel.com/new](https://vercel.com/new) → sign in with GitHub → import `Macro-Tracker`. Framework preset: *Other*. No build command needed.
3. **Set the connection string.** If you created the Neon database through Vercel's Storage tab, this is done for you. Otherwise add an environment variable named `DATABASE_URL` with your Neon connection string (Project Settings → Environment Variables), then redeploy.
4. **Open the deployed URL** and add it to your phone's home screen. The `api/state.js` route creates its table automatically the first time it runs.
