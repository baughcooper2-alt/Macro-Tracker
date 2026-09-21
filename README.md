# Macro Tracker

A single-page macro logger with stats, editable targets, and phase tracking. One HTML file — no build step, no dependencies, no server.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app. |
| `macro_data.csv` | Historical daily macros exported from the Google Sheet, also embedded in `index.html` as seed data. |

## Tabs

**log** — Add foods for any day. Gauges show each macro against the day's targets with how much is left to go. Save anything as a favorite for one-tap re-adding. Edit or delete any entry, including imported day totals. Jump to any date, or copy the previous day forward.

**stats** — Filter by time window (7/14/30/all) or by phase. Hit rates per macro, a switchable chart for each macro with target bands drawn in, a day grid you can tap to jump to that day, streaks, day-of-week averages, weekly table, and written takeaways that recompute from whatever's filtered.

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

Everything you log lives in browser localStorage, per device. Use the CSV export on the data tab to move it or to refresh `macro_data.csv` in this repo.

## Publishing with GitHub Pages

1. Repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
3. Open `https://<username>.github.io/<repo>/` and add it to your phone's home screen.
