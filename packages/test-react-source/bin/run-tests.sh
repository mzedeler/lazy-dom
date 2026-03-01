#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_DIR="$(dirname "$SCRIPT_DIR")"
REACT_DIR="$PACKAGE_DIR/vendor/react"
LAZY_DOM_DIR="$PACKAGE_DIR/../lazy-dom"

if [ ! -d "$REACT_DIR" ]; then
  echo "React not set up. Run: pnpm setup" >&2
  exit 1
fi

# Ensure lazy-dom is built
if [ ! -f "$LAZY_DOM_DIR/dist/lazyDom.js" ]; then
  echo "lazy-dom not built. Run: pnpm --filter lazy-dom build" >&2
  exit 1
fi

cd "$REACT_DIR"

# Run React's source tests with stable release channel.
# Pass additional Jest flags via script args (e.g. --testPathPattern "ReactDOM-test").
node scripts/jest/jest-cli.js --releaseChannel stable "$@"
