# lazyDom
Lazy HTML DOM implementation that is intended to make it possible to run fast tests.

# Monorepo structure

This is a pnpm workspace monorepo with three packages:

 * `packages/lazy-dom` - the core lazy-dom library
 * `packages/test-react` - React and testing-library tests
 * `packages/test-wpt` - Web Platform Tests

# Development
To get started:

```
pnpm i

pnpm --filter lazy-dom dev:watch
```

# Testing

```
# Run all tests (builds first)
pnpm test

# Run tests for a specific package
pnpm --filter lazy-dom test
pnpm --filter @lazy-dom/test-react test
pnpm --filter @lazy-dom/test-wpt test

# Typecheck all packages
pnpm typecheck

# Lint
pnpm lint
```

# Benchmarks
(Probably outdated.)

```
┌─────────┬───────────────────────────────────────────────────┬───────────┬────────────────────┬───────────┬─────────┐
│ (index) │ Task Name                                         │ ops/sec   │ Average Time (ns)  │ Margin    │ Samples │
├─────────┼───────────────────────────────────────────────────┼───────────┼────────────────────┼───────────┼─────────┤
│ 0       │ 'lazyDom: React.createRoot'                       │ '13,702'  │ 72980.66010211612  │ '±27.61%' │ 1371    │
│ 1       │ 'JSDOM: React.createRoot'                         │ '6,064'   │ 164901.9489291599  │ '±25.62%' │ 607     │
│ 2       │ 'lazyDom: React.createRoot + React.createElement' │ '13,284'  │ 75274.42061700366  │ '±25.82%' │ 1329    │
│ 3       │ 'JSDOM: React.createRoot + React.createElement'   │ '5,921'   │ 168886.75777414296 │ '±27.19%' │ 611     │
│ 4       │ 'lazyDom: event handling'                         │ '10,836'  │ 92277.3356953098   │ '±26.58%' │ 1129    │
│ 5       │ 'JSDOM: event handling'                           │ '4,301'   │ 232489.9409090924  │ '±25.06%' │ 440     │
│ 6       │ 'lazyDom: removing child'                         │ '344,269' │ 2904.697359631149  │ '±41.36%' │ 34427   │
│ 7       │ 'JSDOM: removing child'                           │ '82,319'  │ 12147.72266763641  │ '±11.72%' │ 8232    │
└─────────┴───────────────────────────────────────────────────┴───────────┴────────────────────┴───────────┴─────────┘
```

# Author
Michael Zedeler <michael@zedeler.dk>

# License
Copyright 2024 Michael Zedeler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
