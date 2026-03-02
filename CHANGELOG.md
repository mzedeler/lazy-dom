# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-01

### Added

- Core DOM implementation with lazy evaluation via thunks
- WASM-backed child node management for fast structural mutations
- Node, Element, Document, DocumentFragment, Text, Comment, ProcessingInstruction
- ~40 HTML element classes (div, button, input, select, form, table, etc.)
- SVGElement and SVGPathElement
- Event system: Event, UIEvent, MouseEvent, PointerEvent, KeyboardEvent, InputEvent, FocusEvent
- CSS selector support via css-select (`querySelector`, `querySelectorAll`, `matches`, `closest`)
- CSSStyleDeclaration with Proxy-based property access
- DOMTokenList (`classList`) and DOMStringMap (`dataset`)
- NamedNodeMap and Attr with namespace support
- TreeWalker with whatToShow filtering and custom filters
- Range with `createContextualFragment`
- innerHTML/outerHTML serialization and parsing
- Window with `getComputedStyle`, `matchMedia`, and EventTarget support
- JSDOM-compatible API for drop-in replacement
- `lazy-dom/register` entry point for Mocha and other test runners
- `jest-environment-lazy-dom` package for Jest integration
- Dual-backend test suite (JSDOM + lazy-dom) for compatibility verification
- React 18 and @testing-library compatibility
