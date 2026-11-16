#!/usr/bin/env bash
# Pre-deploy check. Runs locally (./scripts/check.sh) and in CI (.github/workflows/check.yml).
# It must pass before every deploy. Edit the PROJECT CHECKS section for this project.
set -euo pipefail
cd "$(dirname "$0")/.."
fail() { echo "✗ $*" >&2; exit 1; }
ok()   { echo "✓ $*"; }

# 1. No secret files or obvious secret values tracked by git.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  tracked_env=$(git ls-files | grep -E '(^|/)\.env(\.[^/]*)?$' | grep -vE '\.env\.example$' || true)
  [ -z "$tracked_env" ] || fail "secret file tracked by git: $tracked_env (git rm --cached it, rotate the values)"
  pattern='-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|sk_live_[0-9A-Za-z]{10,}|sk-(ant-|proj-)?[A-Za-z0-9_-]{30,}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{40,}|xox[baprs]-[0-9A-Za-z-]{10,}|AIza[0-9A-Za-z_-]{35}'
  hits=$(git grep -nIE -e "$pattern" -- . ':(exclude)scripts/check.sh' ':(exclude)*.example' || true)
  [ -z "$hits" ] || { echo "$hits" | cut -c1-120 >&2; fail "possible secret in tracked files (move it to the vault, rotate it)"; }
  ok "no secrets tracked"
fi

# 2. PROJECT CHECKS. Replace the auto-detection with this project's exact commands
#    once they are known, e.g.:  npm ci && npm run lint && npm test && npm run build
#    This project: install, then build. `npm run build` runs build-data.mjs, which fails on
#    a source without a valid URL or a Portuguese row with no matching source.
#    Links are checked separately (`npm run check:links`): too flaky for a gate.
npm ci
npm run build
ok "data + site build"
ok "check passed"
