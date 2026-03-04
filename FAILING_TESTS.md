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
| `app/javascript/features/UserPanel/FoldersPanel/FoldersPanel.test.tsx` | `Should spawn Folder Modal when Create Folder button is clicked` | Timed out in `waitForElementToBeRemoved` (progressbar never removed) |
| `app/javascript/features/UserPanel/FoldersPanel/FoldersPanel.test.tsx` | `Should render Folder Items panel when a Folder is clicked and send the correct tracking data` | Same as above |
| `app/javascript/features/UserPanel/FoldersPanel/FoldersPanel.test.tsx` | `Should spawn Folder Modal when Edit Action is clicked` | Same as above |
| `app/javascript/features/UserPanel/FoldersPanel/FoldersPanel.test.tsx` | `Should traverse user correctly via Breadcrumbs` | Same as above |
| `app/javascript/components/Widget/components/AnnouncementsAsFeed/AnnouncementsAsFeed.test.tsx` | `renders according to snapshot with compact appearance with highlights` | Snapshot mismatch under lazy-dom |
| `app/javascript/components/Widget/components/AnnouncementsAsFeed/AnnouncementsAsFeed.test.tsx` | `only renders announcements with images in product_page_styling_with_images appearance` | Snapshot mismatch under lazy-dom |

## test-react-source (packages/test-react-source)

| File | Test | Reason |
|------|------|--------|
| `packages/react/src/__tests__/ReactClassEquivalence-test.js` | `tests the same thing for es6 classes and CoffeeScript` | Spawns a nested Jest process that fails in the lazy-dom environment |
| `packages/react/src/__tests__/ReactClassEquivalence-test.js` | `tests the same thing for es6 classes and TypeScript` | Same as above |
| `packages/react-dom/src/__tests__/ReactDOMOption-test.js` | `generates a warning and hydration error when an invalid nested tag is used as a child` | Invalid nesting detection difference |
| `packages/react-dom/src/__tests__/ReactRenderDocument-test.js` | `with new explicit hydration API > should not be able to switch root constructors` | Document-level rendering difference |
| `packages/react-dom/src/__tests__/ReactDOMSelection-test.internal.js` | `returns correctly for fuzz test` | Selection API difference |
