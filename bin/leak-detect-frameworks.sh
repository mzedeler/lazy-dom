#!/usr/bin/env bash
# Compare memory growth running N identical test files under Mocha vs Jest,
# each with both lazy-dom and jsdom backends.
#
# Usage: bin/leak-detect-frameworks.sh [N]
#   N = number of test file copies (default 200)
#
# Output: /tmp/leak-frameworks-*.csv  (one per configuration)
#         Comparison table on stdout
set -euo pipefail

N="${1:-200}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMPBASE="/tmp/leak-frameworks-$$"
mkdir -p "$TMPBASE"

# Resolve tool paths once
TSX="$ROOT/packages/lazy-dom/node_modules/.bin/tsx"
MOCHA_BIN="$ROOT/packages/lazy-dom/node_modules/mocha/bin/mocha.js"
JEST_BIN="$ROOT/packages/test-jest/node_modules/.bin/jest"

echo "=== Memory leak comparison: Mocha vs Jest, lazy-dom vs jsdom ==="
echo "Generating $N test file copies..."
echo ""

# ---------- Shared workload (written once) ----------
# Both mocha and jest wrappers import this same file.
cat > "$TMPBASE/workload.js" <<'WORKLOAD_EOF'
// Shared DOM workload — creates a realistic element tree, serializes it,
// then removes it from the document. Returns the outerHTML string.
function runWorkload() {
  const root = document.createElement('div')
  root.setAttribute('class', 'app')
  root.setAttribute('id', 'app-root')
  document.body.appendChild(root)

  const header = document.createElement('header')
  header.setAttribute('class', 'header')
  root.appendChild(header)

  const h1 = document.createElement('h1')
  h1.appendChild(document.createTextNode('My App'))
  header.appendChild(h1)

  const nav = document.createElement('nav')
  nav.setAttribute('class', 'nav')
  header.appendChild(nav)

  for (let i = 0; i < 5; i++) {
    const a = document.createElement('a')
    a.setAttribute('href', '/page-' + i)
    a.appendChild(document.createTextNode('Page ' + i))
    nav.appendChild(a)
  }

  const main = document.createElement('main')
  root.appendChild(main)

  const ul = document.createElement('ul')
  main.appendChild(ul)

  for (let i = 0; i < 15; i++) {
    const li = document.createElement('li')
    li.setAttribute('class', 'card')
    ul.appendChild(li)

    const h2 = document.createElement('h2')
    h2.appendChild(document.createTextNode('Card ' + i))
    li.appendChild(h2)

    const p = document.createElement('p')
    p.appendChild(document.createTextNode('Description for card ' + i + '.'))
    li.appendChild(p)

    const span = document.createElement('span')
    span.appendChild(document.createTextNode('Tag ' + (i % 3)))
    li.appendChild(span)
  }

  const footer = document.createElement('footer')
  footer.appendChild(document.createTextNode('Copyright 2024'))
  root.appendChild(footer)

  const html = root.outerHTML
  document.body.removeChild(root)
  return html
}

module.exports = { runWorkload }
WORKLOAD_EOF

# ---------- Generate mocha test files ----------
MOCHA_DIR="$TMPBASE/mocha"
mkdir -p "$MOCHA_DIR"
for i in $(seq 1 "$N"); do
  cat > "$MOCHA_DIR/test-${i}.test.js" <<MOCHA_EOF
const { expect } = require('chai')
const { runWorkload } = require('../workload.js')

describe('DOM workload', () => {
  afterEach(() => {
    document.body.childNodes.forEach(c => document.body.removeChild(c))
  })

  it('creates and serializes a realistic tree', () => {
    const html = runWorkload()
    expect(html).to.include('Card 14')
  })
})
MOCHA_EOF
done

# ---------- Generate jest test files ----------
JEST_DIR="$TMPBASE/jest"
mkdir -p "$JEST_DIR"
for i in $(seq 1 "$N"); do
  cat > "$JEST_DIR/test-${i}.test.js" <<JEST_EOF
const { runWorkload } = require('../workload.js')

describe('DOM workload', () => {
  afterEach(() => {
    document.body.childNodes.forEach(c => document.body.removeChild(c))
  })

  test('creates and serializes a realistic tree', () => {
    const html = runWorkload()
    expect(html).toContain('Card 14')
  })
})
JEST_EOF
done

# Jest configs
cat > "$JEST_DIR/jest.config.lazydom.js" <<EOF
module.exports = {
  testEnvironment: "jest-environment-lazy-dom",
  maxWorkers: 1,
}
EOF

cat > "$JEST_DIR/jest.config.jsdom.js" <<EOF
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  maxWorkers: 1,
}
EOF

# Symlink node_modules from test-jest so jest + environments are available
ln -sf "$ROOT/packages/test-jest/node_modules" "$JEST_DIR/node_modules"

echo "Generated $N test files in $MOCHA_DIR and $JEST_DIR"
echo "Shared workload: $TMPBASE/workload.js"
echo ""

# ---------- Helper: run a command and monitor RSS ----------
run_with_monitor() {
  local LABEL="$1"
  local CSV="/tmp/leak-frameworks-${LABEL}.csv"
  shift
  echo "elapsed_s,rss_mb" > "$CSV"

  # Run the command in background
  "$@" > "/tmp/leak-frameworks-${LABEL}.log" 2>&1 &
  local PID=$!

  local START
  START=$(date +%s)
  local PEAK=0

  while kill -0 "$PID" 2>/dev/null; do
    local RSS_KB
    RSS_KB=$(node -e "
      const fs = require('fs');
      try {
        const s = fs.readFileSync('/proc/$PID/status', 'utf8');
        const m = s.match(/VmRSS:\\s+(\\d+)/);
        if (m) console.log(m[1]);
      } catch {}
    " 2>/dev/null) || true
    if [ -n "$RSS_KB" ]; then
      local RSS_MB=$((RSS_KB / 1024))
      local ELAPSED=$(( $(date +%s) - START ))
      echo "${ELAPSED},${RSS_MB}" >> "$CSV"
      if [ "$RSS_MB" -gt "$PEAK" ]; then
        PEAK=$RSS_MB
      fi
    fi
    sleep 2
  done

  wait "$PID" || true
  local DURATION=$(( $(date +%s) - START ))

  echo "  [$LABEL] Duration: ${DURATION}s  Peak RSS: ${PEAK} MB  →  $CSV"
}

# ---------- Summary helpers (use node instead of awk) ----------
csv_first() {
  node -e "
    const lines = require('fs').readFileSync('$1','utf8').trim().split('\n');
    if (lines.length > 1) console.log(lines[1].split(',')[1]);
    else console.log('?');
  " 2>/dev/null
}

csv_peak() {
  node -e "
    const lines = require('fs').readFileSync('$1','utf8').trim().split('\n');
    let max = 0;
    for (let i = 1; i < lines.length; i++) {
      const v = parseInt(lines[i].split(',')[1], 10);
      if (v > max) max = v;
    }
    console.log(max || '?');
  " 2>/dev/null
}

csv_last() {
  node -e "
    const lines = require('fs').readFileSync('$1','utf8').trim().split('\n');
    if (lines.length > 1) console.log(lines[lines.length-1].split(',')[1]);
    else console.log('?');
  " 2>/dev/null
}

# ---------- Run all 4 configurations ----------

echo "--- Mocha + lazy-dom ---"
run_with_monitor "mocha-lazydom" \
  "$TSX" --import "$ROOT/packages/lazy-dom/src/register.ts" \
  "$MOCHA_BIN" \
  --no-timeout --extension js \
  "$MOCHA_DIR/*.test.js"

echo ""
echo "--- Mocha + jsdom ---"
run_with_monitor "mocha-jsdom" \
  "$TSX" --import "$ROOT/node_modules/.pnpm/global-jsdom@24.0.0_jsdom@24.0.0/node_modules/global-jsdom/esm/register.mjs" \
  "$MOCHA_BIN" \
  --no-timeout --extension js \
  "$MOCHA_DIR/*.test.js"

echo ""
echo "--- Jest + lazy-dom ---"
run_with_monitor "jest-lazydom" \
  "$JEST_BIN" --config "$JEST_DIR/jest.config.lazydom.js" \
  --roots "$JEST_DIR" --forceExit

echo ""
echo "--- Jest + jsdom ---"
run_with_monitor "jest-jsdom" \
  "$JEST_BIN" --config "$JEST_DIR/jest.config.jsdom.js" \
  --roots "$JEST_DIR" --forceExit

echo ""
echo "=== Results ==="
echo ""
echo "CSV files in /tmp/leak-frameworks-*.csv"
echo "Logs in /tmp/leak-frameworks-*.log"
echo ""

# ---------- Summary table ----------
summary_line() {
  local LABEL="$1"
  local CSV="/tmp/leak-frameworks-${LABEL}.csv"
  if [ ! -f "$CSV" ]; then
    echo "| $LABEL | N/A | N/A | N/A |"
    return
  fi
  local FIRST PEAK LAST
  FIRST=$(csv_first "$CSV")
  PEAK=$(csv_peak "$CSV")
  LAST=$(csv_last "$CSV")
  echo "| $LABEL | ${FIRST:-?} MB | ${PEAK:-?} MB | ${LAST:-?} MB |"
}

echo "| Configuration | Start RSS | Peak RSS | Final RSS |"
echo "|---------------|-----------|----------|-----------|"
summary_line "mocha-lazydom"
summary_line "mocha-jsdom"
summary_line "jest-lazydom"
summary_line "jest-jsdom"

echo ""
echo "Temp files in $TMPBASE"
