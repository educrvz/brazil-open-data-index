# Brazil Open Data Index — runbook

> How to run, check, deploy, roll back and debug. Commands must be copy-pasteable.
> Update this file whenever a step changes.

## First-time setup
```bash
git clone https://github.com/educrvz/brazil-open-data-index.git
cd brazil-open-data-index
npm ci
```
No `.env` needed: the project has no secrets.

## Run locally
```bash
npm run dev        # → http://localhost:5173 (rebuilds src/sources.json first)
```
The language middleware only runs on Vercel; locally the site picks the browser language.

## Test / pre-deploy check
```bash
./scripts/check.sh        # must pass before every deploy (CI runs the same script)
```
It checks that no secrets are tracked, then runs `npm ci` and `npm run build` (which
validates the CSVs). Manual smoke test after data changes: open the site, switch EN/PT,
click two categories, open one card.

Links are not part of the check (government sites are slow and often bot-protected):
```bash
npm run build:data && npm run check:links
```
A 403/429/timeout on IBGE, ANTAQ, gov.br or Painel de Preços is usually bot protection or
rate limiting: open it in a normal browser before changing the data.

## Deploy
- Target: Vercel (educrvzs-projects/brazil-open-data-index) → https://brazil-open-data-index.vercel.app, auto-deploy from GitHub `main`.
- How: run `./scripts/check.sh`, then push to `main`. Vercel builds (`npm run build`, output `dist`) and promotes it.
  Pull requests get a Vercel preview URL.
- After deploying: open https://brazil-open-data-index.vercel.app, check the source count
  ("144 fontes") and that the EN/PT switch works.
- Log it in `PROGRESS.md` (commit, where, result).

## Roll back
1. Fastest: Vercel dashboard → project `brazil-open-data-index` → Deployments → pick the previous production deployment → Promote / Instant Rollback.
2. Code: `git revert <bad-commit> && git push` → Vercel redeploys the previous behavior.
3. Data: the catalog is in git; revert the CSV commit.
Write what happened in `PROGRESS.md`.

## Backups
- Everything (code + data) is in git on GitHub. No database.

## Logs and monitoring
- Build and runtime logs: Vercel dashboard → project → Deployments / Logs.
- CI: GitHub Actions `check` and `notion-signal`.
- Traffic: GoatCounter https://brazil-open-data-index.goatcounter.com (cookieless, aggregate).
  Page views count automatically; events are paths starting with `source/`, `docs/`,
  `download/` and `language/` (see `trackEvent` in `src/main.jsx`). GoatCounter ignores
  localhost and headless browsers, so test it on the live site in a normal browser.
- Alerts: none.

## Secrets inventory
The app has no secrets (`.env.example` is empty on purpose). CI has one.

| Key | What it is | Where it is set in production | Vault item |
|---|---|---|---|
| `NOTION_TOKEN` (GitHub Actions secret, not in `.env`) | Notion internal integration "project-kit sync" token; lets `notion-signal` write Last push / Last commit / Last deploy to the Projects row | Repo → Settings → Secrets → Actions (set with `gh secret set NOTION_TOKEN -R educrvz/brazil-open-data-index`) | Edu's Notion (integration page) |

Set 2026-11-17. Scope: Read + update + insert content; no comments, **no user info**; content access = the 🎯 Projects database only (checked 2026-11-17). Notion tokens cannot expire: **rotate by 2027-02-15**. Renew: Notion → Settings → Developer → Open developer tools → Developer connections → project-kit sync → Refresh API token → copy → `for r in educrvz/ilha-do-sul-inteligencia educrvz/brazil-open-data-index dccrvz/support-agent dccrvz/project-kit; do pbpaste \| gh secret set NOTION_TOKEN -R $r; done` (one token, four repos).

Without `NOTION_TOKEN` the `notion-signal` job passes but only prints "NOTION_TOKEN secret not set; Notion not updated".

## Common issues
| Symptom | Likely cause | Fix |
|---|---|---|
| `npm run build` fails: "Sources without a valid URL" | A row's `URL` has no `http(s)://` link | Put one real URL first in the `URL` cell |
| `npm run build` fails: "sources-pt.csv has names not in sources.csv" | A source was renamed in `sources.csv` only | Rename the row in `data/sources-pt.csv` too |
| PT text on a card is half English | No hand-written Portuguese for that source | Add the row to `data/sources-pt.csv` |
| A card's link is dead | The agency moved or retired the page | Find the new official page, update `URL`, set `Last Verified`, log it |
