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
- Alerts: none.

## Secrets inventory
None. The project has no secrets (`.env.example` is empty on purpose).

| Key (in .env.example) | What it is | Where it is set in production | Vault item |
|---|---|---|---|
| — | — | — | — |

`NOTION_TOKEN` (repo Actions secret, optional) only feeds `notion-signal`; without it the job passes and does nothing.

## Common issues
| Symptom | Likely cause | Fix |
|---|---|---|
| `npm run build` fails: "Sources without a valid URL" | A row's `URL` has no `http(s)://` link | Put one real URL first in the `URL` cell |
| `npm run build` fails: "sources-pt.csv has names not in sources.csv" | A source was renamed in `sources.csv` only | Rename the row in `data/sources-pt.csv` too |
| PT text on a card is half English | No hand-written Portuguese for that source | Add the row to `data/sources-pt.csv` |
| A card's link is dead | The agency moved or retired the page | Find the new official page, update `URL`, set `Last Verified`, log it |
