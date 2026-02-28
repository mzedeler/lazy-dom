# Architecture

lazy-dom is a minimal HTML DOM implementation designed to make JavaScript test execution fast. It replaces heavy implementations like JSDOM by providing just enough of the DOM API to support React and testing libraries, while using lazy evaluation to avoid unnecessary computation.

## Core Principle: Lazy Evaluation via Futures

The central idea is that DOM state is stored as thunks (`Future<T> = () => T`) rather than concrete values. When a property is set, a new function is created that closes over the previous one. The value is only computed when something reads it.

```typescript
// Setting a property doesn't compute anything — it creates a new thunk
this.nodeStore.childNodes = () => lazyAppend(previousChildNodesFuture(), node)

// The work only happens when someone calls nodeStore.childNodes()
```

This means a long sequence of DOM mutations (appending children, removing children, setting attributes) builds up a chain of thunks. If nothing ever reads the intermediate states, that work is never done. In a test environment, large parts of the DOM tree go unread, so this saves significant computation.

Every `*Store` class (`NodeStore`, `ElementStore`, `DocumentStore`) follows this pattern: all fields are `Future<T>` values that default to a throw or an empty value and get overwritten with new thunks as state changes.

## WASM-Backed Child Management

Child node relationships are managed by a WebAssembly module (`src/wasm/nodeOps.ts`). The WASM layer provides:

- `appendChild`, `insertBefore`, `removeChild` — structural mutations
- `getChildIds`, `getChildCount`, `getChildId` — child traversal
- `getParentId` — parent lookup
- `connectSubtree` / `disconnectSubtree` — tracking which elements are in the document

The `NodeRegistry` (`src/wasm/NodeRegistry.ts`) maintains a bidirectional map between WASM integer IDs and JavaScript `Node` objects. Every node registers on construction.

`ChildNodeList` wraps WASM access via a `Proxy` for index-based access (e.g., `childNodes[0]`).

## Class Structure

```
Node (abstract base)
├── CharacterData (abstract: data, length, string manipulation)
│   ├── Text (text node)
│   └── Comment (comment node)
├── Element (attributes, events, CSS selectors, namespaces)
│   ├── HTMLElement (id, title, lang, dir, className, tabIndex, accessKey, draggable)
│   │   ├── HTMLDivElement, HTMLButtonElement, HTMLInputElement, ...
│   │   └── (~40 element classes, one per supported HTML tag)
│   └── SVGElement
│       └── SVGPathElement
├── DocumentFragment (lightweight container)
└── ProcessingInstruction (target + data)

Document (element factory, element registry, querySelector delegation)
├── DOMImplementation (hasFeature)
Window (minimal global object)
Attr (attribute node with name, value, namespaceURI)
NamedNodeMap (attribute collection with NS methods)
DOMException (error codes: HIERARCHY_REQUEST_ERR, NOT_FOUND_ERR, etc.)
```

Each class has a companion store (`NodeStore`, `ElementStore`, `DocumentStore`) that holds the lazy state. The class itself exposes getters that evaluate the store's thunks.

## Document as Element Registry

`DocumentStore` uses WASM (`connectSubtree` / `disconnectSubtree` / `getConnectedElementIds`) for tracking which elements are connected to the document. This enables `getElementById` and `querySelectorAll` without maintaining an eagerly-updated JavaScript index.

## Element Constructor Table

`Document.ts` contains a `constructors` map keyed by `(namespace URI, uppercased tagName)` that maps to element class constructors. When `createElement('div')` is called, it looks up `constructors['http://www.w3.org/1999/xhtml']['DIV']` to find `HTMLDivElement`. Unknown tags fall back to the generic `HTMLElement` class.

## CSS Selector Support

`querySelector` and `matches` are implemented via the `css-select` library with a custom `CssSelectAdapter` that maps css-select's tree-walking interface onto lazy-dom's node structure.

## Namespace Support

Elements and attributes support XML namespaces via `createElementNS`, `setAttributeNS`, `getAttributeNS`, `removeAttributeNS`, and related methods. Namespace validation follows W3C rules for `xml:` and `xmlns:` prefixes.

## Testing Strategy

The same test suite runs against both JSDOM and lazy-dom:

- `pnpm test` — runs both suites (lazydom first, then jsdom)
- `pnpm test:jsdom` — runs tests with JSDOM as the DOM backend
- `pnpm test:lazydom` — runs the same tests with lazy-dom via `src/register.js`

This ensures lazy-dom is a drop-in replacement for the subset of DOM APIs it implements. Tests cover:

- Core DOM operations (Node, Element, CharacterData, Document)
- W3C DOM Level 1 and Level 2 conformance tests (ported from jsdom's test suite, in `test/ported/`)
- React rendering and compatibility with `@testing-library/react` and `@testing-library/dom`

## What This Project Deliberately Does Not Do

- No layout or rendering
- No `window.location`, navigation, or network APIs
- No full spec compliance — only the subset needed by React and testing libraries
- No eager data structures where a lazy one suffices
- No XML parsing (tests requiring parsed XML fixtures are skipped)
- No deprecated elements (HTMLFrameElement, HTMLFontElement, etc.)
