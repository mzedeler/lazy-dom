---
title: Benchmarks
---

> lazy-dom@0.1.0 benchmark /home/runner/work/lazy-dom/lazy-dom/packages/lazy-dom
> pnpm build:wasm && tsx src/benchmark/benchmark.ts -- --md


> lazy-dom@0.1.0 build:wasm /home/runner/work/lazy-dom/lazy-dom/packages/lazy-dom
> asc src/assembly/index.ts --outFile build/wasm/lazy-dom.wasm --optimize --exportRuntime

# Benchmarks

> Generated on 2026-03-12 | Node v22.22.0 | linux x64

## React

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| React.createRoot | 0 | 5,092 | 0.0x |
| React.createRoot + React.createElement | 6,079 | 6,470 | 0.9x |
| event handling | 3,689 | 3,789 | 1.0x |
| React deep render (6 providers) | 2,184 | 2,218 | 1.0x |
| React deep render + snapshot | 2,147 | 2,168 | 1.0x |
| React deep render + rerender | 1,827 | 1,843 | 1.0x |

## Testing Library

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| getByRole | 310 | 318 | 1.0x |

## DOM

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| removing child | 16,843 | 84,724 | 0.2x |
| childNodes[i] access | 2,210 | 2,151 | 1.0x |
| childNodes.forEach | 2,317 | 860 | 2.7x |
| childNodes.length | 1,080 | 2,728 | 0.4x |
| Array.from(childNodes) | 2,365 | 2,288 | 1.0x |
| getElementById (depth-5 tree) | 633 | 618 | 1.0x |
| getElementsByTagNameNS (depth-5 tree) | 594 | 568 | 1.0x |
| document.all (depth-5 tree) | 0 | 559 | 0.0x |
| setAttribute x10 + read | 18,638 | 18,158 | 1.0x |
| setAttribute x50 + read | 5,036 | 5,107 | 1.0x |
| setAttribute x100 + read | 2,632 | 2,636 | 1.0x |
| setAttribute overwrite x50 | 10,528 | 10,664 | 1.0x |
| textContent flat 100 | 2,384 | 2,364 | 1.0x |
| textContent deep 20 | 2,533 | 2,373 | 1.1x |
| textContent mixed 50 | 2,353 | 2,371 | 1.0x |
| bulk tree ~50 elements | 933 | 903 | 1.0x |
| bulk tree ~100 elements | 428 | 414 | 1.0x |
| bulk tree ~200 elements | 222 | 223 | 1.0x |

## Serialization

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| outerHTML wide (100 children) | 430 | 387 | 1.1x |
| outerHTML deep (20 levels) | 1,795 | 1,809 | 1.0x |
| outerHTML realistic (~70 elements) | 633 | 604 | 1.0x |
| innerHTML (50 spans) | 887 | 899 | 1.0x |
