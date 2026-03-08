#!/usr/bin/env bash
# Collect memory data for all three configurations and summarize.
# The new column is "lazy+vm" (our new vm context isolation).
set -euo pipefail

SCRIPT="$(dirname "$0")/run-memmon.sh"

echo "=== Running lazy+vm (new vm context isolation) ==="
"$SCRIPT" lazy-vm jest-environment-lazy-dom

echo ""
echo "=== Running JSDOM baseline ==="
"$SCRIPT" jsdom jest-fixed-jsdom

echo ""
echo "=== Done! ==="
echo "Results in /tmp/memmon-lazy-vm.csv and /tmp/memmon-jsdom.csv"
