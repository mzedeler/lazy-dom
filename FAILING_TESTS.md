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

## pro

| File | Test | Reason |
|------|------|--------|
| `app/javascript/components/RichTextEditor/RichTextEditor.test.tsx` | `Rich text editor > renders as per snapshot` | Snapshot mismatch under lazy-dom |
| `app/javascript/components/AreaLayout/layouts/TabbedLayout/components/LayoutTabs/LayoutTabs.test.tsx` | `LayoutTabs > TabNavigation > persists scroll position when activating overlay tab` | Scroll position APIs not implemented |
| `app/javascript/pages/SearchPage/components/ResultsPanel/components/SearchFeedback/SearchFeedback.test.tsx` | `SearchFeedback > has disabled submitButton initially and enabled when user selects an option` | `findByRole` unable to locate expected buttons |

## test-react-source (packages/test-react-source)

| File | Test | Reason |
|------|------|--------|
| `packages/react/src/__tests__/ReactClassEquivalence-test.js` | `tests the same thing for es6 classes and CoffeeScript` | Spawns a nested Jest process that fails in the lazy-dom environment |
| `packages/react/src/__tests__/ReactClassEquivalence-test.js` | `tests the same thing for es6 classes and TypeScript` | Same as above |
| `packages/react-dom/src/__tests__/DOMPropertyOperations-test.js` | `setValueForProperty > should set values as attributes if necessary` | Attribute handling difference |
| `packages/react-dom/src/__tests__/ReactDOMOption-test.js` | `generates a warning and hydration error when an invalid nested tag is used as a child` | Invalid nesting detection difference |
| `packages/react-dom/src/__tests__/ReactRenderDocument-test.js` | `with new explicit hydration API > should not be able to switch root constructors` | Document-level rendering difference |
| `packages/react-dom/src/__tests__/ReactDOMSelection-test.internal.js` | `returns correctly for fuzz test` | Selection API difference |
| `packages/react-dom/src/__tests__/ReactDOMServerIntegrationAttributes-test.js` | `renders camel cased custom properties` (4 render modes) | CSS custom property (`--someColor`) not preserved through `getPropertyValue` |
