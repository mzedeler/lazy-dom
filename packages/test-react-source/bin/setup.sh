#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_DIR="$(dirname "$SCRIPT_DIR")"
REACT_DIR="$PACKAGE_DIR/vendor/react"
LAZY_DOM_DIR="$PACKAGE_DIR/../lazy-dom"

REACT_VERSION="$(cat "$PACKAGE_DIR/REACT_VERSION" | tr -d '[:space:]')"

echo "React version: $REACT_VERSION"

# Clone React if not already present
if [ ! -d "$REACT_DIR" ]; then
  echo "Cloning React..."
  mkdir -p "$PACKAGE_DIR/vendor"
  git clone --depth 1 --branch "$REACT_VERSION" https://github.com/facebook/react.git "$REACT_DIR"
else
  echo "React already cloned, checking out $REACT_VERSION..."
  cd "$REACT_DIR"
  git fetch --depth 1 origin tag "$REACT_VERSION" 2>/dev/null || true
  git checkout "$REACT_VERSION" 2>/dev/null || true
  cd "$PACKAGE_DIR"
fi

# Install React's dependencies (postinstall may fail due to Node version check — that's OK)
echo "Installing React dependencies..."
cd "$REACT_DIR"
npx yarn@1 install --ignore-scripts
cd "$PACKAGE_DIR"

# Symlink lazy-dom into React's node_modules
echo "Symlinking lazy-dom..."
ln -sfn "$(cd "$LAZY_DOM_DIR" && pwd)" "$REACT_DIR/node_modules/lazy-dom"

# Copy custom Jest environment and stubs
echo "Installing custom Jest environment..."
cp "$PACKAGE_DIR/jest/LazyDomEnvironment.cjs" "$REACT_DIR/scripts/jest/LazyDomEnvironment.js"
cp "$PACKAGE_DIR/jest/stubs.cjs" "$REACT_DIR/scripts/jest/stubs.js"

# Patch config.base.js to use our custom environment instead of jsdom
echo "Patching Jest config..."
sed -i "s|testEnvironment: 'jsdom'|testEnvironment: require.resolve('./LazyDomEnvironment.js')|" "$REACT_DIR/scripts/jest/config.base.js"

echo "Setup complete."
