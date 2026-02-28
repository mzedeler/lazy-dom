# Benchmarking lazyDom

When you run the benchmarks, create a report that looks like this:

Here's a summary of the results from the newest benchmarks and what they reveal:

**setAttribute thunk chain — O(N^2) confirmed:**
- `setAttribute x10`: lazyDom 23,282 ops/s vs JSDOM 7,806 (lazyDom 3x faster)
- `setAttribute x50`: lazyDom 1,677 ops/s vs JSDOM 2,958 (lazyDom **1.8x slower**)
- `setAttribute x100`: lazyDom 394 ops/s vs JSDOM 1,514 (lazyDom **3.8x slower**)
- Scaling from x10→x100 = 59x slowdown (vs expected 10x for linear), confirming quadratic cost
- Overwrite x50 also shows lazyDom 2.3x slower than JSDOM

**textContent reading:**
- Flat 100: roughly equal (lazyDom slightly faster)
- Deep 20: lazyDom 3x faster — but note this only reads direct Text children, not recursively
- Mixed 50: lazyDom ~1.5x faster

**outerHTML/innerHTML serialization:**
- Wide 100 children: lazyDom ~1.9x faster
- Deep 20 levels: lazyDom ~16x faster
- Realistic tree: lazyDom ~2x faster
- innerHTML 50 spans: lazyDom ~2.5x faster

**Bulk tree construction (no reads):**
- Small (~50): lazyDom ~2.2x faster
- Medium (~100): anomalous result (38 ops/s, high variance) — might be GC pressure
- Large (~200): lazyDom ~2.9x faster

**React deep render:**
- Basic render: lazyDom ~2.1x faster
- With snapshot (outerHTML): lazyDom ~2.7x faster
- With rerender: lazyDom ~2.3x faster

The key finding: **setAttribute with many attributes is the clear bottleneck** — it goes from 3x faster to 3.8x slower as count increases, confirming the quadratic thunk chain hypothesis.
