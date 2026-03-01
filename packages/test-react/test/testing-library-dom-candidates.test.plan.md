# Analysis: Three failing `@testing-library/dom` queries

## 1. `queryByRole('textbox')` — missing `HTMLInputElement.type` property

**Failure location:** `node_modules/@testing-library/dom/dist/role-helpers.js:143`

The selector `makeRoleSelector('textbox')` produces:
```
*[role~="textbox"],input:not([type]):not([list]),input[type="text"]:not([list]),...,textarea
```

`querySelectorAll` correctly returns the `<input type="text">` element via css-select. But then `getImplicitAriaRoles()` rejects it.

The role-helpers code has a special case for `type="text"` inputs (issue #814). Instead of using `node.matches()` for the type check, it reads the **DOM property** directly:

```javascript
if (typeTextIndex >= 0 && node.type !== 'text') {
  return false;  // ← rejects the element
}
```

`node.type` is `undefined` because lazy-dom's `HTMLInputElement` is an empty stub — it has no `.type` getter. `undefined !== 'text'` → element rejected.

**Fix:** Add `type` getter to `HTMLInputElement` reflecting the `type` attribute (default `'text'` per HTML spec).

## 2. `queryByRole('button', { name: 'Save' })` — `ChildNodeList` lacks numeric indexing

**Failure location:** `node_modules/.pnpm/dom-accessibility-api@0.5.16/.../accessible-name-and-description.js:243`

The button is found and passes role/accessibility filters. The failure is in the `name` filter, which calls `computeAccessibleName(element)` from `dom-accessibility-api`.

That library uses its own `Array.from` polyfill to convert `node.childNodes`:
```javascript
var childNodes = ArrayFrom(node.childNodes).concat(queryIdRefs(node, "aria-owns"));
```

The polyfill reads `.length` then accesses elements by numeric index (`items[0]`, `items[1]`, etc.). Lazy-dom's `ChildNodeList` has `.length` and `Symbol.iterator`, but **no numeric index access** — so `childNodes[0]` returns `undefined`.

Result: `ArrayFrom(button.childNodes)` → `[undefined]` instead of `[TextNode('Save')]` → accessible name computes to `""` → name filter `"" !== "Save"` → query returns `null`.

**Fix:** Add numeric index getters to `ChildNodeList` (e.g. via a Proxy, or by materializing and caching the array).

## 3. `queryByLabelText('Name')` — missing `HTMLLabelElement.control` property

**Failure location:** `node_modules/@testing-library/dom/dist/label-helpers.js:29-36`

```javascript
function getRealLabels(element) {
  if (element.labels !== undefined) {  // path A: not implemented
    return element.labels ?? [];
  }
  // path B fallback:
  const labels = element.ownerDocument.querySelectorAll('label');
  return Array.from(labels).filter(label => label.control === element);
  //                                       ^^^^^^^^^^^^^^^ undefined
}
```

Path A fails because `HTMLInputElement` has no `.labels` property (`undefined`... but `undefined !== undefined` is false, so actually it enters path A and returns `undefined ?? []` = `[]`). Wait — actually `element.labels` IS `undefined`, and `undefined !== undefined` is false, so the condition `element.labels !== undefined` is **false**. It falls through to path B.

Path B: `querySelectorAll('label')` works and finds the label. But the filter checks `label.control === element` — and `HTMLLabelElement` has no `.control` property, so it's `undefined`. Filter returns empty array.

**Fix:** Add `control` getter to `HTMLLabelElement` that finds the associated element via `this.getAttribute('for')` + `ownerDocument.getElementById()`.

## Summary

| Test | Root cause | Missing API |
|---|---|---|
| `queryByRole('textbox')` | Property access `node.type` returns undefined | `HTMLInputElement.type` getter |
| `queryByRole('button', { name: 'Save' })` | `childNodes[0]` returns undefined | `ChildNodeList` numeric indexing |
| `queryByLabelText('Name')` | `label.control` returns undefined | `HTMLLabelElement.control` getter |
