#!/usr/bin/env bash
# Optional: regenerate EventHub-wireframes.pdf from wireframes.html (Chrome headless).
# Team PDF in repo may be exported manually; this script reproduces a print from HTML.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
HTML="file://${ROOT}/wireframes.html"
OUT="${ROOT}/EventHub-wireframes.pdf"

CHROME="${CHROME_PATH:-}"
if [[ -z "$CHROME" ]]; then
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  do
    [[ -x "$c" ]] && CHROME="$c" && break
  done
fi
if [[ -z "${CHROME}" ]]; then
  echo "Set CHROME_PATH to your Chrome/Chromium binary (or install Google Chrome)." >&2
  exit 1
fi

"${CHROME}" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=15000 \
  --print-to-pdf="${OUT}" \
  "${HTML}"

echo "Wrote ${OUT}"
