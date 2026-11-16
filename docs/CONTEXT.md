# Brazil Open Data Index — context

> What this is and how it fits together. Keep it short and true; update it in the same
> commit whenever reality changes.

## In one paragraph
A public, bilingual (English / Portuguese) catalog of 144 Brazilian public data sources:
federal, state and municipal transparency portals, open-data catalogs, APIs and bulk
files, grouped into categories with access type, formats and granularity. It exists so
researchers, journalists and builders can find the right official source fast, and as a
public portfolio piece for DC Cruz. Anyone can propose a source by pull request.

## Client and people
| Role | Name | Contact | Notes |
|---|---|---|---|
| Client / decision maker | Own product (public interest, open source) | — | |
| Day-to-day contact | Edu | GitHub `educrvz` | |
| Owner (DC Cruz) | Edu | GitHub `educrvz` | |
| Collaborators with deploy rights | none | | Outside contributors open pull requests |

## Scope and contract
- Type: own product, public and open source (see `LICENSE`).
- What is included: the catalog data, the static site, link maintenance.
- What is NOT included: hosting copies of the datasets, APIs of our own, guarantees about third-party portals.
- Maintenance terms: none (own product). Re-check links every few months (`npm run check:links`).

## Architecture
- Data: `data/sources.csv` (one row per source, English text) + `data/sources-pt.csv`
  (optional hand-written Portuguese per source, keyed by `Name`).
- Build: `scripts/build-data.mjs` turns the CSVs into `src/sources.json` and copies the
  CSV to `public/data/sources.csv` (the "CSV" download on the site). It fails on a source
  without a valid URL or a Portuguese row with no matching source.
- Frontend: React 19 + Vite 7 single page (`src/main.jsx`, `src/styles.css`). Portuguese
  text comes from `sources-pt.csv` first, then a phrase-by-phrase translator in `main.jsx`.
- Edge: `middleware.js` (Vercel) sets a default-language cookie from the visitor's country
  (Brazil → Portuguese). A manual language choice is stored and wins.
- Hosting: Vercel, auto-deploy from `main`. No backend, no database, no scheduled jobs.

## Data
- Main entity: a source (name, agency, level, location, domain, URL, docs, access method,
  formats, granularity, coverage, update frequency, description, license, auth, limitations,
  relevance, last verified). Columns are listed in `README.md`.
- No personal or client data. Everything is public information about public portals.
- Backups: git history is the backup.

## Integrations and accounts
| Service | Used for | Account / project | Login lives in |
|---|---|---|---|
| GitHub | Code, pull requests, CI | `educrvz/brazil-open-data-index` (public) | Edu's GitHub |
| Vercel | Hosting + edge middleware | team `educrvzs-projects`, project `brazil-open-data-index` | Edu's Vercel |
| GoatCounter | Cookieless page views + click events (Source/Docs links, CSV download, language) | site code `brazil-open-data-index` (https://brazil-open-data-index.goatcounter.com) | Edu's GoatCounter login |
| Notion | Projects row synced by `notion-signal` (Last push / commit / deploy) | integration "project-kit sync", Projects database | `NOTION_TOKEN` repo Actions secret |

## Where everything is
- Code: this repo (https://github.com/educrvz/brazil-open-data-index); local folder `~/Documents/03 Software & AI/Claude/Code/brazil-open-data-index`
- Docs and history: Notion https://app.notion.com/p/41aeeae1044a81518b0bfe8f8acf767a
- Production URL: https://brazil-open-data-index.vercel.app · Staging: Vercel preview per branch/PR
- Origin of the data: `~/Documents/03 Software & AI/Brazil_public_data/brazil_public_data_MASTER.csv` (June 2026 research master)
- Old copies (stale, do not edit): `~/Documents/Codex/2026-07-01/this-is/outputs/brazil-open-data-index`, `~/Documents/Codex/2026-08-12/ad/work/brazil-open-data-index`
