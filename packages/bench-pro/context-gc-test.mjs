/**
 * Diagnostic: Do vm contexts created by LazyDomEnvironment actually get GC'd?
 *
 * Creates multiple environments with full lazy-dom setup, tears them down,
 * and checks if the vm context globals are collected via WeakRef.
 *
 * Also compiles code in each context to simulate Jest module loading.
 */
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Import lazy-dom from the built package
const lazyDomModule = await import('/home/mike/workspace/lazy-dom/packages/lazy-dom/dist/lazyDom.js');
const lazyDom = lazyDomModule.default.default || lazyDomModule.default;
const reset = lazyDomModule.reset || lazyDomModule.default.reset;

// Simulate large module compilation in a context
function compileModulesInContext(context, count = 50) {
  for (let i = 0; i < count; i++) {
    // Create a module-sized chunk of code (similar to a React component file)
    const code = `
      (function(module, exports, require) {
        'use strict';
        const React = { createElement: function(t,p,...c) { return {type:t,props:p,children:c}; } };
        class Component${i} {
          constructor(props) {
            this.props = props;
            this.state = { count: 0, items: [], loading: false, error: null };
            this.handlers = {};
          }
          setState(update) {
            this.state = Object.assign({}, this.state, typeof update === 'function' ? update(this.state) : update);
          }
          render() {
            return React.createElement('div', { className: 'component-${i}' },
              React.createElement('h1', null, 'Title ' + this.state.count),
              React.createElement('ul', null,
                ...this.state.items.map(function(item, idx) {
                  return React.createElement('li', { key: idx }, item.name);
                })
              ),
              React.createElement('button', { onClick: this.handlers.increment }, 'Click')
            );
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

// Simulate the full environment lifecycle
function createAndTeardownEnvironment(compileModules = true) {
  // === SETUP (mirrors LazyDomEnvironment constructor) ===
  const context = vm.createContext();
  const global = vm.runInContext('this', context);

  // Assign Node.js globals
  global.global = global;
  global.Buffer = Buffer;
  global.ArrayBuffer = ArrayBuffer;
  global.Uint8Array = Uint8Array;
  global.setTimeout = globalThis.setTimeout;
  global.clearTimeout = globalThis.clearTimeout;
  global.setInterval = globalThis.setInterval;
  global.clearInterval = globalThis.clearInterval;
  global.setImmediate = globalThis.setImmediate;
  global.clearImmediate = globalThis.clearImmediate;
  global.console = console;
  global.process = process;
  global.Promise = Promise;
  global.Date = Date;
  global.Symbol = Symbol;

  // Set non-configurable properties (like installCommonGlobals does)
  Object.defineProperty(global, Symbol.for('jest-native-promise'), {
    configurable: false, writable: false, value: Promise
  });
  Object.defineProperty(global, Symbol.for('jest-native-now'), {
    configurable: false, writable: false, value: Date.now
  });

  // Setup lazy-dom
  const { window, document, classes } = lazyDom();
  for (const [name, value] of Object.entries(classes)) {
    Object.defineProperty(global, name, {
      configurable: true, enumerable: true, value, writable: true,
    });
  }
  Object.defineProperty(global, 'document', {
    configurable: true, enumerable: true, value: document, writable: true,
  });

  // Compile modules in the context (simulate Jest module loading)
  if (compileModules) {
    compileModulesInContext(context, 100);
  }

  // Create a WeakRef to track the global
  const weakRef = new WeakRef(global);

  // === TEARDOWN (mirrors LazyDomEnvironment.teardown()) ===
  reset();

  // Delete configurable properties from global
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

  // null references (this simulates what we do in teardown)
  // In the actual environment, we'd null this.context and this.global

  return weakRef;
}

// === Run the test ===
console.log("=== VM Context GC Diagnostic ===\n");

const ITERATIONS = 20;
const weakRefs = [];

console.log(`Creating ${ITERATIONS} environments with full lazy-dom setup + 100 compiled modules each...`);

for (let i = 0; i < ITERATIONS; i++) {
  weakRefs.push(createAndTeardownEnvironment(true));
}

// Force GC multiple times
for (let round = 0; round < 5; round++) {
  globalThis.gc();
  await new Promise(r => setTimeout(r, 100));
}

const alive = weakRefs.filter(wr => wr.deref() !== undefined).length;
const collected = weakRefs.filter(wr => wr.deref() === undefined).length;

console.log(`\nResults after 5 GC rounds:`);
console.log(`  Collected: ${collected}/${ITERATIONS}`);
console.log(`  Still alive: ${alive}/${ITERATIONS}`);

if (alive > 0) {
  console.log(`\n  WARNING: ${alive} vm context globals were NOT collected!`);
  console.log(`  This indicates a memory leak in the environment setup/teardown.`);
} else {
  console.log(`\n  All vm context globals were collected. No leak in environment lifecycle.`);
}

// Also check memory
const mem = process.memoryUsage();
console.log(`\nFinal memory: heap=${Math.round(mem.heapUsed/1024/1024)}MB rss=${Math.round(mem.rss/1024/1024)}MB`);
