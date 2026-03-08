#!/usr/bin/env bash
# Memory monitor for jest test runs.
# Usage: ./run-memmon.sh <label> <test-environment> [extra-jest-args...]
# Writes CSV to /tmp/memmon-<label>.csv with columns: elapsed_s,rss_mb

set -euo pipefail

LABEL="${1:?Usage: $0 <label> <test-environment> [extra-jest-args...]}"
ENV="${2:?Usage: $0 <label> <test-environment> [extra-jest-args...]}"
shift 2

OUT="/tmp/memmon-${LABEL}.csv"
echo "elapsed_s,rss_mb" > "$OUT"

cd /home/mike/workspace/lazy-dom/pro

# Launch jest in background via node directly (not npx, which adds a wrapper layer)
node ./node_modules/.bin/../jest/bin/jest.js \
  --runInBand --forceExit --testEnvironment "$ENV" "$@" \
  > "/tmp/jest-${LABEL}.log" 2>&1 &
JEST_PID=$!

START=$(date +%s)

# Monitor RSS every 2 seconds
while kill -0 "$JEST_PID" 2>/dev/null; do
  NOW=$(date +%s)
  ELAPSED=$(( NOW - START ))
  RSS_MB=$(node -e "
    const fs = require('fs');
    try {
      const s = fs.readFileSync('/proc/$JEST_PID/status', 'utf8');
      const m = s.match(/VmRSS:\\s+(\\d+)/);
      if (m) console.log(Math.round(parseInt(m[1]) / 1024));
    } catch {}
  " 2>/dev/null) || true
  if [ -n "$RSS_MB" ]; then
    echo "${ELAPSED},${RSS_MB}" >> "$OUT"
  fi
  sleep 2
done

wait "$JEST_PID" || true

echo "Done: $LABEL  →  $OUT"
echo "Jest log: /tmp/jest-${LABEL}.log"
