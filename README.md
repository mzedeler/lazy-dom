# lazy-dom

A fast, lazy-evaluated HTML DOM for JavaScript testing. Drop-in JSDOM replacement, 2-4x faster.

[![CI](https://github.com/mzedeler/lazy-dom/actions/workflows/ci.yml/badge.svg)](https://github.com/mzedeler/lazy-dom/actions/workflows/ci.yml)

## Why lazy-dom?

JSDOM is the standard DOM implementation for Node.js testing, but it eagerly evaluates every DOM mutation. In a test environment, most of the DOM tree is never read — yet JSDOM computes it all anyway.

lazy-dom stores DOM state as thunks (lazy functions) instead of concrete values. A chain of DOM mutations builds up a chain of deferred computations, and only the final state is evaluated when something reads it. Combined with a WASM-backed child node manager, this makes lazy-dom **2-4x faster** than JSDOM for typical React test workloads.

## Quick Start

### Jest

```bash
npm install --save-dev lazy-dom jest-environment-lazy-dom
```

```js
// jest.config.js
module.exports = {
  testEnvironment: "jest-environment-lazy-dom",
};
```

### Mocha

```bash
npm install --save-dev lazy-dom
```

```bash
mocha --import lazy-dom/register
```

### Programmatic

```js
import lazyDom from "lazy-dom";

const { window, document, classes } = lazyDom();
```

### JSDOM Compatibility

```js
import { JSDOM } from "lazy-dom";

const dom = new JSDOM("<!DOCTYPE html><p>Hello</p>");
const document = dom.window.document;
```

## Supported APIs

### Core DOM

Node, Element, Document, DocumentFragment, Text, Comment, CharacterData, ProcessingInstruction, Attr, NamedNodeMap, Range, TreeWalker, NodeList, HTMLCollection, DOMTokenList, DOMStringMap

### HTML Elements

~40 element classes including HTMLDivElement, HTMLInputElement, HTMLButtonElement, HTMLFormElement, HTMLSelectElement, HTMLTextAreaElement, HTMLAnchorElement, HTMLImageElement, HTMLTableElement, HTMLIFrameElement, HTMLCanvasElement, and more.

### SVG

SVGElement, SVGPathElement

### Events

Event, UIEvent, MouseEvent, PointerEvent, KeyboardEvent, InputEvent, FocusEvent — with full `addEventListener`, `removeEventListener`, and `dispatchEvent` support.

### CSS

CSSStyleDeclaration with Proxy-based property access (`style.backgroundColor`), `cssText`, `setProperty`, `getPropertyValue`, `removeProperty`.

### Selectors

`querySelector`, `querySelectorAll`, `matches`, `closest` — powered by css-select.

### HTML Serialization

`innerHTML` (get/set), `outerHTML` (get) — with HTML parsing via htmlparser2.

### React Compatibility

React 18 with `@testing-library/react` and `@testing-library/dom`.

## Migrating from JSDOM

### Jest

Replace the test environment:

```diff
// jest.config.js
module.exports = {
-  testEnvironment: "jest-environment-jsdom",
+  testEnvironment: "jest-environment-lazy-dom",
};
```

### Mocha

Replace the `--import` flag:

```diff
- mocha --import global-jsdom/register
+ mocha --import lazy-dom/register
```

### What's Not Supported

lazy-dom implements the subset of DOM APIs needed by React and testing libraries. It does not support:

- Layout, rendering, or `getBoundingClientRect`
- Navigation or network APIs (`fetch`, `XMLHttpRequest`)
- Full W3C spec compliance
- XML parsing
- Deprecated elements (`HTMLFrameElement`, `HTMLFontElement`, etc.)

If your tests rely on these APIs, they will need stubs or should continue using JSDOM.

## How It Works

DOM state is stored as thunks (`Future<T> = () => T`) rather than concrete values. When a property is set, a new function closes over the previous one. The value is only computed when read:

```typescript
// Setting a property creates a new thunk — no computation happens
this.nodeStore.childNodes = () => lazyAppend(previousChildNodesFuture(), node);

// Computation only happens here, when the value is actually needed
const children = nodeStore.childNodes();
```

Every `*Store` class (`NodeStore`, `ElementStore`, `DocumentStore`, etc.) follows this pattern. Child node relationships are managed by a WebAssembly module for fast structural mutations.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full design.

## Benchmarks

lazy-dom is typically **2-4x faster** than JSDOM across React rendering, DOM mutations, and serialization workloads.

See [BENCHMARKS.md](BENCHMARKS.md) for detailed results, updated automatically on each push to `main`.

## Development

This is a pnpm workspace monorepo:

- `packages/lazy-dom` — Core DOM implementation
- `packages/jest-environment-lazy-dom` — Jest test environment
- `packages/test-react` — React and @testing-library tests
- `packages/test-wpt` — Web Platform Tests

```bash
pnpm install
pnpm build

# Run all tests (both JSDOM and lazy-dom backends)
pnpm test

# Run only the lazy-dom backend (faster during development)
pnpm --filter lazy-dom test:lazydom

# Typecheck and lint
pnpm typecheck
pnpm lint
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
