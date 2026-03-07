# Performance Analysis

## Real-World Benchmark: bench-pro

Benchmark run against a production React application with 465 Jest test suites, comparing `jest-fixed-jsdom` vs `jest-environment-lazy-dom`. Both run `--runInBand --forceExit`.

### Summary (2026-03-07, after adding ResizeObserver/IntersectionObserver stubs)

| Metric | Value |
|--------|-------|
| Total suites | 465 |
| Passing in both | 449 |
| Failing/missing in lazy-dom | 16 |
| JSDOM total time | 221.1s |
| lazy-dom total time | 324.6s |
| **Overall speedup** | **0.7x (47% slower)** |

lazy-dom is currently **slower overall**. Code path analysis (see below) shows the bottleneck is per-operation WASM bridge overhead, not initialization.

Adding `ResizeObserver`/`IntersectionObserver` stubs fixed 5 of the 7 original severe outliers (e.g., `deCamelCaseObjectKeys` 2.0s → 168ms, `useBreakpointObserver` 2.0s → 205ms) but did not change the overall ratio. 41 tests still balloon to ~2s from < 1s in JSDOM — these likely have a different root cause (possibly missing APIs causing `waitFor()` timeouts).

### Performance by Test Weight Class

| Weight class (JSDOM time) | Suites | lazy-dom faster | Aggregate JSDOM | Aggregate lazy-dom | Ratio |
|---------------------------|--------|-----------------|-----------------|--------------------|----|
| Heavy (>= 1s) | 39 | 36 (92%) | 85.5s | 64.5s | **1.32x** |
| Medium-heavy (500ms-1s) | 79 | 42 (53%) | 52.4s | 67.7s | 0.77x |
| Medium (200ms-500ms) | 179 | 16 (9%) | 68.5s | 163.3s | 0.42x |
| Light (< 200ms) | 153 | 0 (0%) | 13.9s | 26.5s | 0.52x |

**Key insight**: lazy-dom wins decisively on heavy tests (1.32x faster) where lazy evaluation skips intermediate DOM states. It loses on lighter tests due to per-operation WASM bridge overhead. The medium bracket (0.42x) is hit hardest — enough DOM work for overhead to accumulate, not enough redundant mutations for laziness to help.

### Speedup Distribution (450 passing suites)

| Bracket | Count | Pct |
|---------|-------|-----|
| >= 2.0x (lazy-dom much faster) | 3 | 0.7% |
| 1.5x - 2.0x | 10 | 2.2% |
| 1.2x - 1.5x | 30 | 6.7% |
| 1.0x - 1.2x (about equal) | 51 | 11.3% |
| 0.8x - 1.0x (lazy-dom slightly slower) | 97 | 21.6% |
| 0.5x - 0.8x (lazy-dom slower) | 186 | 41.3% |
| < 0.5x (lazy-dom much slower) | 73 | 16.2% |

94 suites faster, 356 slower.

### Top 10 lazy-dom Wins

| Test file | JSDOM | lazy-dom | Speedup |
|-----------|-------|----------|---------|
| CompanyUploadTagsView.test.tsx | 4.2s | 1.2s | 3.4x (71%) |
| RegisterPage.test.tsx | 2.1s | 948ms | 2.2x (55%) |
| UserAlerts.test.tsx | 1.7s | 770ms | 2.2x (55%) |
| DocumentResult.test.tsx | 1.1s | 601ms | 1.9x (46%) |
| SearchPage.test.tsx | 7.6s | 4.4s | 1.7x (42%) |
| ProductsMenu.test.tsx | 1.9s | 1.1s | 1.7x (42%) |
| utils.test.ts (HelpAndFeedback) | 241ms | 145ms | 1.7x (40%) |
| DocumentInfo.test.tsx | 3.3s | 2.0s | 1.7x (40%) |
| UserNote.test.tsx | 997ms | 639ms | 1.6x (36%) |
| ContentAreaHeader.test.tsx | 1.1s | 711ms | 1.6x (37%) |

### Severe Regressions (> 5x slower)

| Test file | JSDOM | lazy-dom | Slowdown |
|-----------|-------|----------|----------|
| deCamelCaseObjectKeys.test.ts | 100ms | 2.0s | 0.05x (1904% slower) |
| useBreakpointObserver.test.ts | 127ms | 2.0s | 0.1x (1470% slower) |
| reducer.test.ts (DocumentSearch) | 168ms | 1.9s | 0.1x (1058% slower) |
| LoadMore.test.tsx (CompanyUploads) | 231ms | 2.1s | 0.1x (797% slower) |
| LoadMore.test.tsx | 236ms | 2.0s | 0.1x (767% slower) |
| MainWidgetLayout.test.tsx (NoMarginWithSidebar) | 289ms | 2.1s | 0.1x (625% slower) |
| usePageTitle.test.tsx | 325ms | 2.2s | 0.1x (577% slower) |

These all show a similar pattern: tests that take 100-300ms in JSDOM balloon to ~2s in lazy-dom. The consistent ~2s ceiling strongly suggests `waitFor()` timeouts (default 1000ms + retry) caused by missing API stubs — see analysis below.

### Failing Suites (15)

11 suites under `app/javascript/App/tests/` (routing/page-level integration tests) all fail. These likely depend on APIs lazy-dom doesn't implement (e.g., navigation, History API features, or specific global stubs).

Other failures:
- `ProductShortcutFavouritesList.test.tsx`
- `BookInfoTab.test.tsx`
- `UnifiedDocumentNavigationbar.test.tsx`
- `applyV2UserHighlight.test.ts`

### Root Cause Analysis: Per-Operation WASM Bridge Overhead

The initial hypothesis was that initialization overhead (~100-200ms per test) explained the regression. **Code path analysis disproves this.** The overhead scales with test complexity, proving it's per-operation, not per-initialization:

| Weight class | JSDOM avg | lazy-dom avg | Overhead | Overhead % |
|---|---|---|---|---|
| Light (< 200ms) | 90ms | 173ms | 83ms | 92% |
| Medium (200-500ms) | 383ms | 912ms | 529ms | 138% |
| Med-heavy (500ms-1s) | 663ms | 857ms | 194ms | 29% |
| Heavy (>= 1s) | 2192ms | 1654ms | -538ms | -25% (win) |

If initialization were the bottleneck, the overhead would be **constant** across brackets. Instead, the medium bracket has 6.4x the overhead of the light bracket. The overhead is proportional to the amount of DOM read operations — specifically, tree traversals via css-select.

#### What initialization actually costs

Traced from `new LazyDomEnvironment()` through all code paths:

1. **WASM instantiation** (one-time per process, not per test file):
   - `wasmLoader.ts` calls `readFileSync()` (14KB) + `instantiateSync()` at module import
   - Cached by Node.js module system across all test files in `--runInBand` mode
   - Cost: ~10-50ms total, amortized to near-zero per file

2. **`lazyDom()` call** (per test file):
   - `new Window()`: EventTargetStore + Selection — trivial object allocation
   - `new Document()`: one WASM call (`createDocument()`)
   - Document tree (html/head/body): deferred via thunks until first `document.body` access
   - Cost: ~1-3ms

3. **Global patching** (per test file):
   - ~50 `Object.defineProperty()` calls for DOM classes, stubs, timer polyfills
   - Cost: ~1-2ms

4. **Module-level side effects** (one-time per process):
   - `Element.ts`: `new CssSelectAdapter()` — empty state object
   - `HTMLElement.ts`: `defineStringReflections()` — prototype mutations
   - `Window.ts`: Set/Record literals for CSS defaults
   - Cost: negligible

**Total per-test-file initialization: ~3-5ms.** This is comparable to JSDOM's `jest-fixed-jsdom` environment setup (which creates a full JSDOM instance per file). Initialization is NOT the bottleneck.

#### The real bottleneck: WASM round-trips in child node traversal

The hot path is `NodeStore.getChildNodesArray()`, called on every node during every css-select tree traversal:

```
CssSelectAdapter.getChildren(node)           -- src/utils/CssSelectAdapter.ts:12
  → Array.from(node.childNodes)              -- iterates ChildNodeList
    → ChildNodeList[Symbol.iterator]()       -- src/classes/Node/ChildNodeList.ts:63
      → NodeStore.getChildNodesArray()       -- src/classes/Node/NodeStore.ts:25
        → nodeOps.getChildIds(wasmId)        -- src/wasm/nodeOps.ts:66
          → wasm.getChildIds(nodeId)         -- JS→WASM call
          → wasm.__getArray(ptr)             -- copy array from WASM linear memory → JS
        → for each id:
            NodeRegistry.getNodeOrThrow(id)  -- Map.get() per child
        → new Array(ids.length)              -- allocate result array
```

**In JSDOM**, `getChildren()` returns a JavaScript array that's already in memory. Zero serialization, zero bridge crossing.

**In lazy-dom**, every `getChildren()` call requires:
- 1 WASM function call (JS→WASM context switch)
- 1 array copy from WASM linear memory to JavaScript heap
- N `Map.get()` lookups (one per child node)
- 1 new Array allocation
- Plus `Array.from()` in `CssSelectAdapter.getChildren()` copies the array again

For a tree with 100 nodes, a single `querySelector()` call traverses the tree via `findOne()`/`findAll()`/`getText()`, calling `getChildNodesArray()` for **every node visited**:
- ~100 WASM calls to `getChildIds()`
- ~100 array copies from WASM memory
- ~300 `Map.get()` lookups (avg 3 children per node)
- ~100 array allocations
- ~100 `Array.from()` copies in the adapter

A typical React test that calls `render()` + 3-4 `screen.getBy*()` queries does this traversal 4-5 times. With 50-200 nodes in the tree, that's **500-1000 WASM round-trips per test**.

#### `nextSibling`/`previousSibling`: equally expensive

These properties are accessed during TreeWalker traversal and css-select sibling checks:

```typescript
// src/classes/Node/Node.ts:112-118
get nextSibling(): Node | null {
    const parentId = nodeOps.getParentId(this.wasmId)  // WASM call 1
    const siblingIds = nodeOps.getChildIds(parentId)   // WASM call 2 + array copy
    const myIndex = siblingIds.indexOf(this.wasmId)    // O(n) linear scan
    return NodeRegistry.getNode(siblingIds[myIndex + 1]) ?? null  // Map lookup
}
```

In JSDOM: one pointer dereference. In lazy-dom: 2 WASM calls + array copy + linear scan.

#### `appendChild()`: multiple WASM calls per mutation

```typescript
// src/classes/Node/Node.ts:235-267  (simplified)
appendChild(node: Node) {
    nodeOps.getParentId(node.wasmId)         // WASM call 1: check old parent
    nodeOps.removeChild(oldParentId, ...)    // WASM call 2: remove from old parent
    nodeOps.setParentId(node.wasmId, ...)    // WASM call 3: set new parent
    nodeOps.appendChild(this.wasmId, ...)    // WASM call 4: add to children
    this.ownerDocument.documentStore.connect(node)  // WASM call 5: connectSubtree
}
```

5 WASM round-trips for a single `appendChild()`. React's reconciler calls this for every element it creates.

#### Why child nodes are NOT lazily managed

Despite the architecture claiming "all fields are `Future<T>` values", child nodes are **eagerly fetched from WASM on every access**. `NodeStore.getChildNodesArray()` directly calls WASM — there is no thunk chain, no memoization:

```typescript
// src/classes/Node/NodeStore.ts:25-32
getChildNodesArray(): Node[] {
    const ids = nodeOps.getChildIds(this.wasmId);  // Always hits WASM
    const result: Node[] = new Array(ids.length);
    for (let i = 0; i < ids.length; i++) {
        result[i] = NodeRegistry.getNodeOrThrow(ids[i]);
    }
    return result;
}
```

The lazy thunks (`Future<T>`) are only used for scalar properties: `ownerDocument`, `nodeValue`, element attributes, `tagName`, `style`. The most frequently accessed data — child node arrays — bypasses the lazy system entirely.

#### Why heavy tests win despite all this

Heavy tests (>= 1s, 1.32x faster) succeed because:
1. They render **large** component trees with many mutations before any reads
2. Lazy evaluation of scalar properties (attributes, text content) skips intermediate states
3. The high ratio of writes-to-reads means thunk chains collapse efficiently
4. The amortized cost of WASM structural operations is competitive with JSDOM for bulk work

#### Why medium tests are worst

Medium tests (200-500ms, 0.42x) are the worst bracket because:
1. They render moderate component trees (enough DOM for overhead to accumulate)
2. They **read immediately after writing**: render → query → assert → repeat
3. Every query forces a full tree traversal through the WASM bridge
4. Lazy evaluation provides no benefit (everything is read, so all thunks are forced)
5. The WASM overhead is a pure tax with no lazy-evaluation payoff

#### Severe outliers: missing observer APIs cause timeouts

The 7 tests that balloon to ~2s share a pattern: their consistent timing suggests `waitFor()` timeouts (testing-library default: 1000ms) rather than slow execution.

**Missing APIs confirmed by code search:**
- `ResizeObserver` — not provided by lazy-dom or jest-environment-lazy-dom
- `IntersectionObserver` — not provided by lazy-dom or jest-environment-lazy-dom

Affected tests:
- `useBreakpointObserver.test.ts` — likely uses `ResizeObserver`
- `LoadMore.test.tsx` (x2) — likely uses `IntersectionObserver`
- `MainWidgetLayout.test.tsx` — likely uses `ResizeObserver` for layout
- `usePageTitle.test.tsx` — may use `MutationObserver` on `<title>`
- `deCamelCaseObjectKeys.test.ts` — pure utility; may import a module that triggers observer-dependent initialization
- `reducer.test.ts` — may import components with observer dependencies

Tests that `waitFor()` for observer callbacks that never fire wait for the full timeout period, explaining the consistent ~2s (1000ms timeout + overhead + possible retry).

### Priority Optimization Targets (revised)

1. **Cache `getChildNodesArray()` results on the JS side** — Invalidate on structural mutations (`appendChild`, `removeChild`, `insertBefore`). This is the single highest-impact change: css-select calls this for every node in every traversal, and the child array rarely changes between consecutive reads. A dirty-flag + cached array would eliminate ~90% of WASM round-trips during queries.

2. **Cache `nextSibling`/`previousSibling` as JS-side references** — Store direct Node references, updated on structural mutations. Eliminates 2 WASM calls + array copy + linear scan per access.

3. **Provide `ResizeObserver`/`IntersectionObserver` stubs** in the jest environment — Fixes the ~2s outliers. Even no-op stubs that call callbacks synchronously would work.

4. **Reduce `appendChild()` WASM calls** — Batch the 5 separate WASM calls into a single compound operation, or maintain parent/child state on the JS side with WASM as secondary storage.

5. **Fix failing suites** — The 11 `App/tests/` failures likely share a root cause (missing routing/navigation API).

---

## Call-Chain Reference: `getChildNodesArray()` Code Paths

### All direct call sites

**`src/classes/Node/ChildNodeList.ts`:**
- `forEach()` (line 44): `this.nodeStore.getChildNodesArray()`
- `keys()` (line 52): `this.nodeStore.getChildNodesArray().map()`
- `entries()` (line 56): `this.nodeStore.getChildNodesArray().map()`
- `values()` (line 60): `this.nodeStore.getChildNodesArray()`
- `[Symbol.iterator]()` (line 64): `this.nodeStore.getChildNodesArray()`

**`src/classes/Element.ts`:**
- `get outerHTML`: `this.nodeStore.getChildNodesArray().map()`
- `get textContent`: `this.nodeStore.getChildNodesArray()`

**`src/classes/Node/NodeStore.ts`:**
- `getChildNode(index)` (line 19): `nodeOps.getChildId()` — single WASM call
- `getChildNodesArray()` (line 25): `nodeOps.getChildIds()` — WASM call + array build

### Key files

1. `src/classes/Node/NodeStore.ts` — `getChildNodesArray()` and `getChildNode()`
2. `src/classes/Node/ChildNodeList.ts` — 5 call sites of `getChildNodesArray()`
3. `src/utils/CssSelectAdapter.ts` — `getChildren()` calls `Array.from(node.childNodes)`
4. `src/classes/Node/Node.ts` — `nextSibling`/`previousSibling` with WASM round-trips, `appendChild()` with 5 WASM calls
5. `src/wasm/nodeOps.ts` — JS wrapper over WASM; `getChildIds()` copies array from WASM memory
6. `src/wasm/wasmLoader.ts` — Synchronous WASM instantiation at module import time
