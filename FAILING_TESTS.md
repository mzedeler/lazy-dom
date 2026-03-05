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

No failing tests.
