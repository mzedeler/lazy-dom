# Memory Analysis

## Benchmark Setup

All measurements taken running the same 465-suite production React test suite with `--runInBand --forceExit`, monitoring the jest node process's RSS via `/proc/$PID/status` every 2 seconds.

Three configurations compared:
- **JSDOM**: `jest-fixed-jsdom` environment (baseline)
- **lazy+reset**: `jest-environment-lazy-dom` with `NodeRegistry.clear()` in teardown
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

## Key Findings

**JSDOM's memory stays flat at ~1.3 GB** throughout the entire run. It successfully releases each test file's DOM when the environment is torn down.

**lazy-dom's memory grows linearly** — even with the NodeRegistry reset, it climbs from 25 MB to 5 GB. The NodeRegistry reset allows V8 to GC old Node objects between test files, saving ~1,350 MB (21%) at peak versus no reset. But the WASM node and document tables still accumulate state because they cannot be safely reset — stale async callbacks (e.g. from `@radix-ui/react-focus-scope` timers) reference old WASM node IDs after teardown, and clearing the WASM tables causes fatal aborts.

### Why lazy-dom leaks

The `NodeRegistry` is a module-level `Map<number, Node>()` mapping WASM integer IDs to JavaScript Node objects. The WASM `NodeTable` and `DocumentTable` are also module-level maps. In `--runInBand` mode, these singletons persist across all 465 test files:

- **NodeRegistry (JS)**: Every DOM node created by every test file is registered. Without cleanup, all Node objects (with their stores, closures, and references) remain in memory. The `reset()` fix clears this map in teardown, allowing GC.
- **WASM NodeTable**: Stores `nodeType`, `parentId`, `ownerDocumentId`, and `childIds` per node. Compact (integers only), but grows monotonically. Cannot be reset without risking WASM aborts from stale references.
- **WASM DocumentTable**: Stores `bodyId` and `connectedElementIds` per document. Same constraint.

### Why JSDOM doesn't leak

JSDOM creates a completely self-contained `JSDOM()` instance per test file. When the jest environment's `teardown()` runs, the old instance becomes unreferenced and V8 GCs the entire DOM tree. There are no shared singletons between test files.

### Path forward

To match JSDOM's flat memory profile, lazy-dom would need to either:

1. **Make WASM state per-document** rather than global — each `lazyDom()` call gets its own WASM instance or namespace, so teardown can safely destroy all state for that document without affecting other documents.
2. **Use `FinalizationRegistry`/`WeakRef`** in NodeRegistry to allow automatic cleanup when Node objects are GC'd, and add guards in WASM functions to handle missing node IDs gracefully (return 0 instead of aborting).
3. **Flush all pending timers** before reset — ensure no stale callbacks can reference old nodes. This would require integration with jest's timer handling and the RAF flush mechanism already in place.
