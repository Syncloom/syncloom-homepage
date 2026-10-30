#!/bin/sh
# Builds the site with Hugo and checks it in a real browser (needs Docker).
set -e
cd "$(dirname "$0")"
docker run --rm -v "$PWD":/src hugomods/hugo:exts hugo --minify --gc >/dev/null
rm -rf e2e/shots && mkdir -p e2e/shots
docker run --rm --ipc=host -v "$PWD/e2e":/e2e -v "$PWD/public":/site:ro -v syncloom-e2e-nm:/e2e/node_modules -w /e2e mcr.microsoft.com/playwright:v1.50.0-jammy \
  sh -c "python3 -m http.server 8090 -d /site >/dev/null 2>&1 & sleep 1; npx playwright test 2>&1 | grep -v 'npm notice'"
