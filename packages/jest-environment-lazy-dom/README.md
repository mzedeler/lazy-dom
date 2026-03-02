# jest-environment-lazy-dom

Jest test environment powered by [lazy-dom](https://www.npmjs.com/package/lazy-dom) for fast DOM testing. Drop-in replacement for `jest-environment-jsdom`, 2-4x faster.

## Install

```bash
npm install --save-dev lazy-dom jest-environment-lazy-dom
```

## Setup

```js
// jest.config.js
module.exports = {
  testEnvironment: "jest-environment-lazy-dom",
};
```

Or per-file with a docblock:

```js
/**
 * @jest-environment jest-environment-lazy-dom
 */
```

## Migrating from jest-environment-jsdom

```diff
// jest.config.js
module.exports = {
-  testEnvironment: "jest-environment-jsdom",
+  testEnvironment: "jest-environment-lazy-dom",
};
```

That's it. lazy-dom implements the same DOM APIs that JSDOM provides for React and @testing-library tests.

## What's Included

- Full DOM API subset (Node, Element, Document, Events, CSS, Selectors)
- React 18 + @testing-library compatibility
- `localStorage` and `sessionStorage` stubs
- `getComputedStyle`, `matchMedia`, `MutationObserver` stubs
- Timer functions (`setTimeout`, `requestAnimationFrame`, etc.)

## Learn More

See the [lazy-dom repository](https://github.com/mzedeler/lazy-dom) for full documentation, benchmarks, and architecture details.

## License

MIT
