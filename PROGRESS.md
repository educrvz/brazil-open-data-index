# Progress — Brazil Open Data Index

Dated log of every change, newest first. Each entry says what changed, why, which checks
ran, whether it was deployed, and what is still open. Format: see `AGENTS.md`.

## 2026-11-19 — Fix high Dependabot alerts (Edu + Claude Code)

Bumped `vite` to ^7.3.7 and refreshed the lockfile so `source-map-js`, `browserslist`,
`nanoid` and `postcss` resolve to patched versions; added an npm `overrides` entry for
`zod` (^4.6.6), which arrives transitively via `@vercel/functions` → `@vercel/oidc`.
Why: 8 high alerts open since 16/11. Checks: `npm run build` PASS; `npm ls` shows patched
versions. Deployed: on merge (Vercel). Open: 5 medium + 1 low alerts not addressed here.

## 2026-11-15 — GoatCounter analytics; NOTION_TOKEN documented (Edu + Claude Code)

Added GoatCounter (cookieless, aggregate) to `index.html` with site code
`brazil-open-data-index`, plus click events from `src/main.jsx`: `source/<slug>` and
`docs/<slug>` (card links and card click), `download/sources-csv`, `language/en|pt`.
Bilingual footer note says visits are counted anonymously, without cookies.
Docs: GoatCounter in CONTEXT integrations and RUNBOOK monitoring; `NOTION_TOKEN` in the
RUNBOOK secrets table (GitHub Actions secret for `notion-signal`).
Checks: `./scripts/check.sh` passes; local preview in headless Chromium: count.js loads,
`goatcounter.count` receives language, source and CSV events, no page errors (GoatCounter
itself ignores localhost/headless, so real counts start on the live site).
Deployed: yes, push to main → Vercel (this commit).
Open (Edu): create the GoatCounter site `brazil-open-data-index` (counts are rejected until
it exists); create the Notion integration "project-kit sync", connect it to the Projects
database, and set `NOTION_TOKEN` here (and in dccrvz/project-kit) so Notion gets Last push /
deploy automatically. Notion: done (maintenance log + Work Log task).

## 2026-11-15 — Link and card audit fixes (Edu + Claude Code)

Audit of all 144 cards and 167 links on the live site (headless browser + HTTP checks).
Fixed in `data/sources.csv`: dead links for Tocantins (domain gone → transparencia.to.gov.br),
INCRA Acervo Fundiário (→ SIGEF), ONR (→ ridigital.org.br), SINESP (dados.mj.gov.br gone →
MJSP statistics page + dados.gov.br dataset), CONAB (/info-agro 404 → gov.br/conab), BCB SGS
(Fonte 502 → bcb.gov.br/estatisticas/sgs; Docs was an API template with `{codigo}` → BCB open
data page, template kept as text), INDE (→ inde.gov.br), Painel PNAB (404 → program page);
redirects stored at their final address (CAR, CEPEA, PNCP, Recife, JUCESP). Replaced the
unsourced "DATASUS - FTP S3 Mirror (community)" card (empty link, unverifiable claims) with
the real community tools microdatasus / PySUS. Alagoas really has an API → badge now "Open API".
MDS VIS DATA is offline for maintenance (official notice): link kept, limitation noted.
38 cards whose English text was in Portuguese now have English text; new
`data/sources-pt.csv` gives hand-written Portuguese for 60 cards (fixes half-translated PT
cards like SICONFI and Dados RS). Added the missing "Pago/Paid" pill to the legend.
`build-data.mjs` now fails on a source without a URL or an orphan Portuguese row.
Added `npm run check:links` (`scripts/check-links.mjs`). `Last Verified` = 2026-11-15 for
the 141 rows checked; ANTT, GeoSGB and MDS VIS DATA keep their old date (unreachable today).
Checks: `./scripts/check.sh` passes; local preview re-checked in headless Chromium: 144 cards
in EN and PT, no empty links, no English left in PT text, category counts match, no mobile overflow.
Deployed: yes, push to main → Vercel (this commit). Rollback: standard (RUNBOOK).
Open: re-check ANTT/GeoSGB/MDS; 9 CSV rows keep several URLs or notes in one cell (cards use the
first URL); IBGE/ANTAQ/Painel de Preços answer 403 to scripts (bot protection, fine in a browser).
Notion: done (Projects row + Claude Work Log task).

## 2026-11-15 — Adopted into the project-kit standard (project-kit adopt-project)

Canonical folder: `~/Documents/03 Software & AI/Claude/Code/brazil-open-data-index` → repo https://github.com/educrvz/brazil-open-data-index.
Other copies found (not the live home, marked with STALE_COPY.md):
- `~/Documents/Codex/2026-08-12/ad/work/brazil-open-data-index`: 100% identical, 0 files only there, 0 changed and newer there
- `~/Documents/Codex/2026-07-01/this-is/outputs/brazil-open-data-index`: 87% identical, 0 files only there, 0 changed and newer there
Added: .env.example, .github/workflows/check.yml, .github/workflows/notion-signal.yml, AGENTS.md, CLAUDE.md, GEMINI.md, PROGRESS.md, docs/CONTEXT.md, docs/ISSUE_TEMPLATE.md, docs/RUNBOOK.md, docs/decisions/0001-one-project-home.md, docs/decisions/README.md, docs/decisions/_TEMPLATE.md, scripts/check.sh.
Merged: .gitignore (+23 rules).
Docs filled the same day (CONTEXT, RUNBOOK, project rules in AGENTS.md, ADR 0002: repo stays public under educrvz). Notion: done (Projects row created, linked both ways).

