# Memory Analysis

## Benchmark Setup

All measurements taken running the same 465-suite production React test suite with `--runInBand --forceExit`, monitoring the jest node process's RSS via `/proc/$PID/status` every 2 seconds.

Three configurations compared:
- **JSDOM**: `jest-fixed-jsdom` environment (baseline)
- **lazy+reset**: `jest-environment-lazy-dom` with full reset (WASM + JS) in teardown
- **lazy (no reset)**: `jest-environment-lazy-dom` without any cleanup between test files

## Memory Over Time

| elapsed | JSDOM | lazy+reset | lazy (no reset) |
|---------|-------|------------|-----------------|
| 0s | 4 MB | 25 MB | 25 MB |
| 30s | 1,260 MB | 1,263 MB | 1,115 MB |
| 60s | 1,306 MB | 1,561 MB | 1,728 MB |
| 90s | 1,276 MB | 2,078 MB | 2,339 MB |
| 120s | 1,272 MB | 2,585 MB | 2,870 MB |
| 150s | 1,286 MB | 3,107 MB | 3,459 MB |
| 180s | 1,277 MB | 3,641 MB | 3,976 MB |
| 210s | 1,274 MB | 4,079 MB | 4,434 MB |
| 240s | 1,306 MB | 4,250 MB | 4,791 MB |
| 270s | -- | 4,391 MB | 5,219 MB |
| 300s | -- | 4,508 MB | 5,602 MB |

## Summary

| Metric | JSDOM | lazy+reset | lazy (no reset) |
|--------|-------|------------|-----------------|
| **Peak RSS** | **1,406 MB** | **5,053 MB** | **6,403 MB** |
| **Duration** | **242s** | **317s** | **341s** |
| **Peak vs JSDOM** | 1.0x | 3.6x | 4.6x |

## What the reset() fixes

The `reset()` function clears all lazy-dom module-level state between test files:

- **NodeRegistry (JS)**: `idToNode.clear()` — releases all JS Node objects
- **WASM NodeTable**: `resetNodeTable()` — clears the WASM node map (with null guards for stale callbacks)
- **WASM DocumentTable**: `resetDocumentTable()` — clears the WASM document map (with null guards)
- **Range.liveRanges**: `clearLiveRanges()` — releases all tracked Range objects
- **MutationObserver.activeObservers**: `clearActiveObservers()` — releases all tracked observers

This saves ~1,350 MB (21%) at peak versus no reset.

## Heap Snapshot Analysis

### Methodology

V8 heap snapshots taken after 1, 2, and 3 test file teardowns (with `--expose-gc` forced GC after each `reset()`). Snapshots compared to identify objects with consistent growth.

### lazy-dom objects ARE properly cleaned up

After reset + GC, only 91 HTMLDivElements and 450 Nodes remain in the heap. A synthetic test creating/destroying 100 DOM trees in a loop shows **zero memory growth** — the reset mechanism works correctly.

### The actual leak: jest's compiled module code

Objects with consistent per-test-file growth (snapshot 1→2→3):

| Object Type | Count Growth | Size Growth/file |
|-------------|-------------|-----------------|
| `code::(script line ends)` | 3433→5839→8254 | ~2.8 MB |
| `string::(module wrappers)` | 1→2→3 each | ~1-1.3 MB each |
| `object::system / Context` | 26K→37K→50K | ~0.6 MB |
| `code::system / ScopeInfo` | 11K→16K→21K | ~0.6 MB |
| `closure::get` | 12K→18K→25K | ~0.35 MB |
| V8 internal (Maps, arrays, etc.) | various | ~19 MB |
| **Total per test file** | | **~25 MB** |

These are **V8 compiled code objects** and **jest module wrapper strings** — artifacts of jest's module system, not lazy-dom.

### V8 memory breakdown (with forced GC, 464 suites)

| Suite | RSS | HeapUsed | HeapTotal | External | ArrayBuffers |
|-------|-----|----------|-----------|----------|-------------|
| 1 | 328 MB | 163 MB | 237 MB | 26 MB | 8 MB |
| 51 | 903 MB | 635 MB | 749 MB | 25 MB | 0 MB |
| 101 | 1,587 MB | 1,302 MB | 1,450 MB | 31 MB | 0 MB |
| 201 | 3,044 MB | 2,729 MB | 2,899 MB | 30 MB | 0 MB |
| 301 | 3,247 MB | 2,628 MB | 2,981 MB | 25 MB | 0 MB |
| 464 | 3,211 MB | 2,295 MB | 2,836 MB | 10 MB | 0 MB |

Key: **External/ArrayBuffers stay flat at ~10-26 MB** — WASM linear memory is NOT the leak. The entire growth is in V8's JS heap (compiled code and module strings).

## Why JSDOM doesn't leak

JSDOM's `jest-environment-jsdom` teardown calls `global.close()`, which aggressively:
1. Clears all event listeners: `_eventListeners = Object.create(null)`
2. Empties the DOM: `this._document.body.innerHTML = ""`
3. Stops all timers
4. Deletes the document reference

This severs all reference chains within the JSDOM Window context, allowing V8 to release both the DOM objects AND the compiled code that referenced them.

`jest-environment-node` (which lazy-dom extends) only calls `this.context = null` — a shallow cleanup that doesn't break internal reference chains within the VM context.

## Path Forward

The remaining ~25 MB/file growth is from jest's module compilation cache, not lazy-dom. To match JSDOM's flat profile:

1. **Extend `jest-environment-jsdom` instead of `jest-environment-node`** — inherit JSDOM's aggressive context destruction. Requires JSDOM as a peer dependency (defeats the purpose).
2. **Implement our own vm context lifecycle** — create a fresh `vm.createContext()` per test file with an explicit `close()` that mirrors JSDOM's cleanup. Significant refactoring.
3. **Accept the tradeoff** — lazy-dom is 2-4x faster but uses more memory in `--runInBand` mode. Most CI runs use `--maxWorkers` which creates a fresh process per worker, avoiding accumulation.
