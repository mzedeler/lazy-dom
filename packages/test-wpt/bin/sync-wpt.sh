#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Read the pinned commit SHA (skip comment lines)
WPT_VERSION="$(grep -v '^#' "$PROJECT_ROOT/WPT_VERSION" | tr -d '[:space:]')"

if [ -z "$WPT_VERSION" ]; then
  echo "Error: WPT_VERSION file is empty or missing" >&2
  exit 1
fi

MANIFEST="$SCRIPT_DIR/wpt-files.txt"
VENDOR_DIR="$PROJECT_ROOT/vendor/wpt"

echo "Syncing WPT files at commit $WPT_VERSION"
echo "Destination: $VENDOR_DIR"

# Read each line from the manifest, skip blanks and comments
while IFS= read -r filepath || [ -n "$filepath" ]; do
  # Skip empty lines and comments
  [[ -z "$filepath" || "$filepath" =~ ^# ]] && continue

  dest="$VENDOR_DIR/$filepath"
  dest_dir="$(dirname "$dest")"
  mkdir -p "$dest_dir"

  url="https://raw.githubusercontent.com/web-platform-tests/wpt/$WPT_VERSION/$filepath"
  echo "  Fetching $filepath"
  if ! curl -fsSL -o "$dest" "$url"; then
    echo "  WARNING: Failed to download $filepath" >&2
  fi
done < "$MANIFEST"

echo "Done. Downloaded WPT files to $VENDOR_DIR"
