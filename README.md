# Brazil Open Data Index

A public, contribution-friendly index of Brazilian public datasets, APIs, portals, bulk files, and civic data sources.

The site supports English and Portuguese through the in-page language switcher.
Visitors from Brazil default to Portuguese based on Vercel geolocation. Manual language choices are saved in the browser and override the geolocation default.

The site is built from `data/sources.csv`, which currently contains 144 sources. Links were last checked on 2026-11-15 (`npm run check:links`).

Live site: https://brazil-open-data-index.vercel.app

Inspired by [Open Data Index — Daily Proto](https://daily-proto.vercel.app/open-data).

## Run locally

```bash
npm install
npm run dev
```

## Update the catalog

1. Edit `data/sources.csv` (English text). Put one real URL in `URL`; extra URLs or notes in `API/Docs` come after the first URL.
2. Optional: add hand-written Portuguese for that source in `data/sources-pt.csv` (same `Name`). Blank cells fall back to automatic translation.
3. Run `npm run build:data` (it fails if a source has no valid URL or a Portuguese row has no matching source).
4. Run `npm run check:links` to see dead or moved links.
5. Open a pull request with a short explanation and a source link.

## Deploy

This app is a Vite static site. It can be deployed on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

For Vercel:

```bash
npm run build
```

Use `dist` as the build output.

## Data columns

- `Name`
- `Agency`
- `Level`
- `State/Municipality`
- `Domain`
- `URL`
- `API/Docs`
- `Access Method`
- `Formats`
- `Granularity`
- `Temporal Coverage`
- `Update Frequency`
- `What You Can Get`
- `License/Terms`
- `Auth Required`
- `Limitations`
- `Venture Relevance`
- `Last Verified`

## License

Code is MIT. Catalog entries are intended as public factual metadata; contributors should only add public-source references and links.
