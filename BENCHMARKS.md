# Benchmarks

> Generated on 2026-03-02 | Node v22.1.0 | linux x64

## React

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| React.createRoot | 12,306 | 5,504 | 2.2x |
| React.createRoot + React.createElement | 11,835 | 5,409 | 2.2x |
| event handling | 7,676 | 3,773 | 2.0x |
| React deep render (6 providers) | 4,513 | 2,140 | 2.1x |
| React deep render + snapshot | 3,248 | 784 | 4.1x |
| React deep render + rerender | 108 | 467 | 0.2x |

## Testing Library

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| getByRole | 461 | 313 | 1.5x |

## DOM

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| removing child | 176,060 | 74,811 | 2.4x |
| childNodes[i] access | 2,523 | 1,792 | 1.4x |
| childNodes.forEach | 1,249 | 335 | 3.7x |
| childNodes.length | 361 | 2,511 | 0.1x |
| Array.from(childNodes) | 3,084 | 2,190 | 1.4x |
| getElementById (depth-5 tree) | 1,857 | 605 | 3.1x |
| getElementsByTagNameNS (depth-5 tree) | 1,653 | 583 | 2.8x |
| document.all (depth-5 tree) | 1,686 | 555 | 3.0x |
| setAttribute x10 + read | 32,178 | 17,263 | 1.9x |
| setAttribute x50 + read | 2,213 | 5,020 | 0.4x |
| setAttribute x100 + read | 570 | 2,495 | 0.2x |
| setAttribute overwrite x50 | 3,586 | 9,607 | 0.4x |
| textContent flat 100 | 2,223 | 2,178 | 1.0x |
| textContent deep 20 | 282 | 2,413 | 0.1x |
| textContent mixed 50 | 2,845 | 2,154 | 1.3x |
| bulk tree ~50 elements | 2,604 | 859 | 3.0x |
| bulk tree ~100 elements | 923 | 384 | 2.4x |
| bulk tree ~200 elements | 591 | 202 | 2.9x |

## Serialization

| Benchmark | lazy-dom (ops/sec) | JSDOM (ops/sec) | Speedup |
|---|---:|---:|---:|
| outerHTML wide (100 children) | 658 | 419 | 1.6x |
| outerHTML deep (20 levels) | 2,745 | 1,804 | 1.5x |
| outerHTML realistic (~70 elements) | 940 | 608 | 1.5x |
| innerHTML (50 spans) | 1,303 | 803 | 1.6x |
