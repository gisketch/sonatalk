#!/usr/bin/env bash
set -euo pipefail
# Full-arc e2e: agent-browser CLI drives the deck UI; scripts/rehearse.mjs plays the crowd.
# Prereqs: vite on :5173, server on :8787 (fresh session, DRAW_SECONDS=6 recommended),
#          rehearse.mjs phones already spawned.

DECK_URL="${1:-http://localhost:5173/?key=dev-token}"

ab() { agent-browser "$@"; }

ab open "$DECK_URL" >/dev/null
ab wait 1500

# walk to the simulator slide (index 8)
for _ in $(seq 8); do ab press ArrowRight >/dev/null; done
ab wait 1500

# live tiers: click through until the button offers the draw timer (text-driven, click-loss proof)
for _ in $(seq 40); do
  label="$(ab get text '.sim-ctl .btn')"
  case "$label" in
    *"start the 60s draw"*) break ;;
  esac
  ab click '.sim-ctl .btn' >/dev/null || true
  ab wait 1300
done
echo "tiers shipped: $(ab get text '.sim-ctl .btn')"

# 60s draw (server may shorten via DRAW_SECONDS), then picks
ab click '.sim-ctl .btn' >/dev/null
for _ in $(seq 30); do
  label="$(ab get text '.sim-ctl .btn')"
  case "$label" in
    *"to the picks"*) break ;;
  esac
  sleep 1
done
ab click '.sim-ctl .btn' >/dev/null
sleep 2

# battle slide
ab press ArrowRight >/dev/null
ab wait '.arena-ctl .btn'
ab click '.arena-ctl .btn' >/dev/null

# battle self-terminates ≤90s; poll for the winner overlay
for _ in $(seq 24); do
  if [ "$(ab is visible '.winner-overlay')" = "true" ]; then break; fi
  sleep 5
done
winner="$(ab get text '.winner-title')"
names="$(ab get text '.winner-names')"

# crown → reveal
ab click '.arena-ctl .btn' >/dev/null
ab wait 1000
ab press ArrowRight >/dev/null
ab wait 1800
gallery="$(ab get count '.gallery figure')"

echo "winner:  ${winner} (${names})"
echo "gallery: ${gallery} drawings"
[ "${gallery}" -ge 1 ] || { echo "FAIL: empty gallery"; exit 1; }
echo "e2e ok"
