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

## Iterator-Based Child Node Lists

Child nodes are stored as `Iterator<Node>` (not arrays). Operations like `appendChild` and `removeChild` produce new iterators via generator functions (`lazyAppend`, `lazyFilter`) that wrap the previous iterator. This avoids copying arrays on every mutation. The iterator is only materialized into an array when something actually traverses the children (e.g., `textContent`, `outerHTML`, `childNodes.length`).

## Class Structure

```
Node (abstract base)
├── Element (attributes, events, CSS selectors)
│   ├── HTMLElement
│   │   ├── HTMLDivElement, HTMLButtonElement, HTMLInputElement, ...
│   │   └── (one class per supported HTML tag)
│   └── SVGElement
│       └── SVGPathElement
└── Text (text node with data)

Document (element factory, element registry, querySelector delegation)
Window (minimal global object)
```

Each class has a companion store (`NodeStore`, `ElementStore`, `DocumentStore`) that holds the lazy state. The class itself exposes getters that evaluate the store's thunks.

## Document as Element Registry

`Document` maintains a lazy list of all connected elements (`documentStore.elements`). When a node is appended, `connect()` wraps the previous elements thunk with one that adds the subtree. When removed, `disconnect()` wraps it with one that filters the subtree out. This supports `getElementById` and `querySelectorAll` without maintaining an eagerly-updated index.

## CSS Selector Support

`querySelector` and `matches` are implemented via the `css-select` library with a custom `CssSelectAdapter` that maps css-select's tree-walking interface onto lazy-dom's node structure.

## Testing Strategy

The same test suite runs against both JSDOM and lazy-dom:

- `pnpm test:jsdom` — runs tests with JSDOM as the DOM backend
- `pnpm test:lazydom` — runs the same tests with lazy-dom via `src/register.js`

This ensures lazy-dom is a drop-in replacement for the subset of DOM APIs it implements. Tests cover core DOM operations, React rendering, and compatibility with `@testing-library/react` and `@testing-library/dom`.

## What This Project Deliberately Does Not Do

- No layout or rendering
- No `window.location`, navigation, or network APIs
- No full spec compliance — only the subset needed by React and testing libraries
- No eager data structures where a lazy one suffices
