# Failing Tests

Tests skipped due to failures when running under lazy-dom. These represent
missing features or behavioral differences compared to the native/JSDOM
implementations.

## lazy-dom (packages/lazy-dom)

| File | Test | Reason |
|------|------|--------|
| `src/classes/Document.test.ts` | `scrollingElement > returns the documentElement` | JSDOM returns `undefined` for `document.scrollingElement` |
| `src/classes/Document.test.ts` | `scrollingElement > is defined` | Same as above |
| `src/classes/elements/HTMLInputElement.test.ts` | `files > returns null for file inputs` | JSDOM returns a `FileList` instead of `null` |
| `src/classes/UIEvent.test.ts` | `PointerEvent > passes detail from init dict` | `PointerEvent` is not defined in the JSDOM test environment |
| `src/classes/UIEvent.test.ts` | `InputEvent > has getTargetRanges method` | JSDOM's `InputEvent` does not implement `getTargetRanges()` |

## test-react-source (packages/test-react-source)

| File | Test | Reason |
|------|------|--------|
| `packages/react/src/__tests__/ReactClassEquivalence-test.js` | `tests the same thing for es6 classes and CoffeeScript` | Spawns a nested Jest process that fails in the lazy-dom environment |
| `packages/react/src/__tests__/ReactClassEquivalence-test.js` | `tests the same thing for es6 classes and TypeScript` | Same as above |
| `packages/react-dom/src/__tests__/ReactDOMOption-test.js` | `generates a warning and hydration error when an invalid nested tag is used as a child` | Invalid nesting detection difference |
| `packages/react-dom/src/__tests__/ReactRenderDocument-test.js` | `with new explicit hydration API > should not be able to switch root constructors` | Document-level rendering difference |
| `packages/react-dom/src/__tests__/ReactDOMSelection-test.internal.js` | `returns correctly for fuzz test` | Selection API difference |
