# SalesFlow — portfolio demo

An interactive, front-end-only version of **SalesFlow**, a sales entry and reporting system built for a clothing retailer in Yangon.
The production app runs on Vercel serverless functions with Google Sheets as the database; this demo swaps the backend for an in-browser store so anyone can try it safely.

**Stack:** vanilla HTML, CSS and JavaScript · hand-drawn SVG charts · no framework, no build step, no CDN or online links (Geist fonts are bundled in `fonts/`, SIL Open Font License).

## What you can try

| Screen | Features |
|---|---|
| Sign in | Any username/password (demo), show/hide password, inline validation, loading state |
| Dashboard | 7 / 30 / 90-day and this-month ranges, change vs previous period, today's sales, Pending/Delivered/Returned cards (click to open filtered history), interactive trend chart, top items, recent sales |
| New sale | Multi-item orders with **Add item**, size dropdown, item/color suggestions, live order summary, inline errors, double-submit protection |
| Sales history | Search (all fields / name / phone / item), size, color, status and date filters, sort, pagination, change status in the table, view, edit, delete with confirmation, formula-safe CSV export |
| Reports | Daily / weekly / monthly grouping, custom range, revenue, average order, best period, best-selling items, breakdown table |
| Settings | Business name, currency, timezone, size and color options, reset demo data, sign out |

Responsive from 360px phones to wide desktops, light and dark mode, keyboard accessible.

## Run it

Open `index.html` in a browser — or serve the folder with any static server:

```bash
npx serve .
```

## Put it on kaunghtetsan.online

Upload the whole folder (e.g. to `/projects/salesflow/`) on your host. All paths are relative, so it works from any sub-folder.
Then link to it from your portfolio project card, e.g. `https://kaunghtetsan.online/projects/salesflow/`.

## Demo data

- 120 days of sample orders are generated on first load (same data for every visitor), relative to today's date.
- Changes are saved in the visitor's own browser (`localStorage`) and never leave it. **Settings → Reset demo data** restores the sample.
- All customer names, phone numbers and amounts are fictional.

## Files

```
index.html        app shell
fonts/            Geist + Geist Mono (woff2, OFL licence)
css/styles.css    design tokens (light + dark), layout, components
js/store.js       sample-data generator + localStorage store (stands in for the Sheets API)
js/charts.js      analytics (totals, buckets) + SVG line chart and bar list
js/app.js         router, pages, dialogs, toasts, CSV export
```
