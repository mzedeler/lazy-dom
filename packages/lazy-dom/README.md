# lazy-dom

A fast, lazy-evaluated HTML DOM for JavaScript testing. Drop-in JSDOM replacement, 2-4x faster.

## Install

```bash
npm install lazy-dom
```

## Quick Start

### With Jest

Use the companion package [`jest-environment-lazy-dom`](https://www.npmjs.com/package/jest-environment-lazy-dom):

```bash
npm install --save-dev jest-environment-lazy-dom
```

```js
// jest.config.js
module.exports = {
  testEnvironment: "jest-environment-lazy-dom",
};
```

### With Mocha

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
```

## Supported APIs

- **Core DOM**: Node, Element, Document, DocumentFragment, Text, Comment, Attr, NamedNodeMap, Range, TreeWalker, NodeList, HTMLCollection, DOMTokenList, DOMStringMap
- **HTML Elements**: ~40 element classes (div, input, button, form, select, table, anchor, image, etc.)
- **SVG**: SVGElement, SVGPathElement
- **Events**: Event, UIEvent, MouseEvent, PointerEvent, KeyboardEvent, InputEvent, FocusEvent
- **CSS**: CSSStyleDeclaration with Proxy-based property access
- **Selectors**: querySelector, querySelectorAll, matches, closest
- **HTML Serialization**: innerHTML (get/set), outerHTML (get)
- **React**: React 18 + @testing-library/react + @testing-library/dom

## How It Works

DOM state is stored as thunks instead of concrete values. Mutations build up chains of deferred computations, and only the final state is evaluated when read. Combined with WASM-backed child node management, this makes lazy-dom 2-4x faster than JSDOM.

See the [full documentation on GitHub](https://github.com/mzedeler/lazy-dom) for architecture details, benchmarks, and migration guides.

## License

MIT — see [LICENSE](LICENSE).
