/**
 * Diagnostic: Does sequential environment creation/teardown cause memory growth?
 *
 * Simulates Jest's runInBand: create env, run "test" (compile code), teardown, repeat.
 * Measures memory growth per iteration to match the real benchmark pattern.
 */
import vm from 'node:vm';

const lazyDomModule = await import('/home/mike/workspace/lazy-dom/packages/lazy-dom/dist/lazyDom.js');
const lazyDom = lazyDomModule.default.default || lazyDomModule.default;
const reset = lazyDomModule.reset || lazyDomModule.default.reset;

// Simulate compiling a realistic amount of code (like React + app modules)
function compileRealisticModules(context, count = 200) {
  for (let i = 0; i < count; i++) {
    // Each module ~2-5KB of code, simulating real app modules
    const stateFields = Array.from({length: 10}, (_, j) =>
      `field${j}: ${j % 2 === 0 ? '""' : '0'}`
    ).join(', ');

    const methods = Array.from({length: 5}, (_, j) => `
      method${j}(arg) {
        const result = [];
        for (let k = 0; k < 10; k++) {
          result.push({ index: k, value: arg + k, nested: { a: k * 2, b: k * 3 } });
        }
        this.state.field${j % 10} = result.length;
        return result;
      }`
    ).join('\n');

    const code = `
      (function(module, exports, require) {
        'use strict';
        class Component${i} {
          constructor() { this.state = { ${stateFields} }; }
          ${methods}
          render() {
            return { type: 'div', props: { className: 'c${i}' }, children: [
              { type: 'span', props: {}, children: [String(this.state.field0)] },
              { type: 'ul', props: {}, children: Array.from({length: 5}, (_, i) => (
                { type: 'li', props: { key: i }, children: [String(i)] }
              ))}
            ]};
          }
        }
        module.exports = Component${i};
      })
    `;
    vm.compileFunction(code, ['module', 'exports', 'require'], {
      parsingContext: context,
    });
  }
}

function runOneSuite() {
  const context = vm.createContext();
  const global = vm.runInContext('this', context);

  // Minimal global setup
  global.global = global;
  global.Buffer = Buffer;
  global.console = console;
  global.process = process;
  global.Promise = Promise;

  // Non-configurable props (like installCommonGlobals)
  Object.defineProperty(global, Symbol.for('jest-native-promise'), {
    configurable: false, writable: false, value: Promise
  });

  // Setup lazy-dom
  const { window, document, classes } = lazyDom();
  for (const [name, value] of Object.entries(classes)) {
    Object.defineProperty(global, name, {
      configurable: true, enumerable: true, value, writable: true,
    });
  }
  global.document = document;

  // Compile ~200 modules (simulating React + app code)
  compileRealisticModules(context, 200);

  // Teardown
  reset();

  // Delete configurable properties
  for (const key of Object.getOwnPropertyNames(global)) {
    const desc = Object.getOwnPropertyDescriptor(global, key);
    if (desc?.configurable) {
      try { delete global[key]; } catch {}
    }
  }
  for (const sym of Object.getOwnPropertySymbols(global)) {
    const desc = Object.getOwnPropertyDescriptor(global, sym);
    if (desc?.configurable) {
      try { delete global[sym]; } catch {}
    }
  }

  // GC (simulates our teardown gc() call)
  globalThis.gc();
}

// === Main ===
console.log("=== Sequential Environment GC Test ===\n");
console.log("Each iteration: create context + lazy-dom + compile 200 modules + teardown + gc()\n");

const ITERATIONS = 200;

globalThis.gc();
await new Promise(r => setTimeout(r, 100));
globalThis.gc();
const baseline = process.memoryUsage();

for (let i = 0; i < ITERATIONS; i++) {
  runOneSuite();

  if ((i + 1) % 25 === 0) {
    // Extra GC to ensure cleanup
    await new Promise(r => setTimeout(r, 50));
    globalThis.gc();
    const m = process.memoryUsage();
    const heapGrowth = Math.round((m.heapUsed - baseline.heapUsed) / 1024 / 1024);
    const rssGrowth = Math.round((m.rss - baseline.rss) / 1024 / 1024);
    console.log(`  suite=${i + 1}  heapGrowth=${heapGrowth}MB  rssGrowth=${rssGrowth}MB  heap=${Math.round(m.heapUsed/1024/1024)}MB`);
  }
}

// Final cleanup
for (let i = 0; i < 5; i++) {
  globalThis.gc();
  await new Promise(r => setTimeout(r, 200));
}

const final = process.memoryUsage();
const totalHeapGrowth = Math.round((final.heapUsed - baseline.heapUsed) / 1024 / 1024);
const totalRssGrowth = Math.round((final.rss - baseline.rss) / 1024 / 1024);
console.log(`\nFinal after ${ITERATIONS} suites: heapGrowth=${totalHeapGrowth}MB  rssGrowth=${totalRssGrowth}MB`);
console.log(`Rate: ${(totalHeapGrowth / ITERATIONS).toFixed(2)} MB/suite`);
