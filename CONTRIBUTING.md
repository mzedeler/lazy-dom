# Contributing to lazy-dom

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/mzedeler/lazy-dom.git
cd lazy-dom

# Install dependencies (requires pnpm)
pnpm install

# Build everything (includes WASM compilation)
pnpm build

# Run the full test suite
pnpm test
```

### Prerequisites

- Node.js >= 20
- pnpm >= 9

## Project Structure

This is a pnpm workspace monorepo:

- `packages/lazy-dom` - Core DOM implementation
- `packages/jest-environment-lazy-dom` - Jest test environment
- `packages/test-react` - React and testing-library tests
- `packages/test-wpt` - Web Platform Tests

## Key Concepts

### Lazy Evaluation via Thunks

The core architecture uses thunks (`Future<T> = () => T`) instead of concrete values. When a DOM property is set, a new function is created that closes over the previous one. Values are only computed when read.

This means you should **always use the thunk pattern** when implementing mutations. See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed explanation and [STYLE.md](STYLE.md) for coding conventions.

### Store Classes

Every DOM class has a companion `*Store` class (e.g., `NodeStore`, `ElementStore`) that holds the lazy state. The DOM class itself exposes getters that evaluate the store's thunks.

## Running Tests

The same test suite runs against both JSDOM and lazy-dom to ensure compatibility:

```bash
# Run both backends
pnpm test

# Run only the lazy-dom backend (faster during development)
pnpm --filter lazy-dom test:lazydom

# Run only the JSDOM backend
pnpm --filter lazy-dom test:jsdom

# Typecheck all packages
pnpm typecheck

# Lint
pnpm lint
```

## Pull Request Expectations

Before submitting a PR, make sure:

- [ ] All tests pass (`pnpm test`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] New mutations use the lazy thunk pattern
- [ ] Type assertions (`as`) are avoided in favor of correct types

## Filing Issues

Please file issues at [github.com/mzedeler/lazy-dom/issues](https://github.com/mzedeler/lazy-dom/issues). Include:

- Your Node.js version
- Your test framework and version
- A minimal reproduction case
- Expected vs actual behavior
- Whether the same code works with JSDOM
