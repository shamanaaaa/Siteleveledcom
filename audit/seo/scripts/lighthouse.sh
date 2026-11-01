#!/usr/bin/env bash
# Lighthouse (mobile + desktop) for every indexable route on production, one run at a time.
# /api/* is blocked inside Lighthouse so no backend endpoint is ever called (audit rule 1).
set -u
BASE="${1:-https://siteleveled.com}"
OUT="${2:-audit/seo/raw/lighthouse}"
mkdir -p "$OUT"
export CHROME_PATH="$HOME/.cache/puppeteer/chrome/linux-155.0.8059.79/chrome-linux64/chrome"
LH=server/node_modules/.bin/lighthouse
for route in / /sluzby /portfolio /proces /o-nas /cennik /blog /kontakt /seo-audit; do
  slug=$([ "$route" = "/" ] && echo home || echo "${route#/}" | tr '/' '_')
  for preset in mobile desktop; do
    extra=()
    [ "$preset" = desktop ] && extra=(--preset=desktop)
    "$LH" "$BASE$route" "${extra[@]}" \
      --chrome-flags="--headless=new --no-sandbox" \
      --blocked-url-patterns='*/api/*' \
      --only-categories=performance,accessibility,best-practices,seo \
      --output=json --output=html --output-path="$OUT/${slug}-${preset}" \
      --quiet || echo "FAILED $route $preset"
    echo "done $route $preset"
    sleep 5
  done
done
# Under WSL, chrome-launcher creates its temp profiles as "C:\Users\…\lighthouse.XXXX" folders in the
# current directory; remove them so the repository stays clean
find . -maxdepth 1 -type d -name 'C:\\*lighthouse.*' -exec rm -rf {} +
