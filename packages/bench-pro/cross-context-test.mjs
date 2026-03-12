/**
 * Diagnostic: Does executing code that creates cross-context references cause leaks?
 *
 * This test simulates what happens when React runs in a vm context and interacts
 * with lazy-dom objects (which live in the process context):
 * - Event handlers (vm-context functions stored by lazy-dom EventTarget)
 * - MutationObserver callbacks
 * - DOM node references held by React fibers
 */
import vm from 'node:vm';

const lazyDomModule = await import('/home/mike/workspace/lazy-dom/packages/lazy-dom/dist/lazyDom.js');
const lazyDom = lazyDomModule.default.default || lazyDomModule.default;
const reset = lazyDomModule.reset || lazyDomModule.default.reset;

function runOneSuite() {
  const context = vm.createContext();
  const global = vm.runInContext('this', context);

  // Minimal global setup
  global.global = global;
  global.Buffer = Buffer;
  global.console = console;
  global.process = process;
  global.Promise = Promise;
  global.setTimeout = globalThis.setTimeout;
  global.clearTimeout = globalThis.clearTimeout;
  global.queueMicrotask = globalThis.queueMicrotask;

  // Non-configurable props
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

  // Compile AND EXECUTE code that creates cross-context references
  // This simulates React creating event handlers, refs, and DOM interactions
  const testCode = `
    (function(document, window) {
      'use strict';

      // Simulate React-like component rendering
      const components = [];
      for (let i = 0; i < 50; i++) {
        const div = document.createElement('div');
        div.className = 'component-' + i;
        div.setAttribute('data-testid', 'comp-' + i);

        // Create event handlers (vm-context functions stored by lazy-dom)
        const handler = function(e) { return e.type; };
        div.addEventListener('click', handler);
        div.addEventListener('mousedown', handler);

        // Create nested structure
        for (let j = 0; j < 5; j++) {
          const child = document.createElement('span');
          child.textContent = 'item ' + j;
          child.addEventListener('click', function() { return j; });
          div.appendChild(child);
        }

        document.body.appendChild(div);
        components.push(div);
      }

      // Simulate MutationObserver usage (like React's)
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) { /* no-op */ });
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Simulate more DOM operations
      for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.innerHTML = '<p>test <strong>content</strong> here</p>';
        document.body.appendChild(el);
        // Query operations
        document.querySelectorAll('div');
        document.querySelector('.component-' + (i % 50));
      }

      // Disconnect observer
      observer.disconnect();

      // Remove components (simulating React unmount)
      for (const comp of components) {
        comp.remove();
      }

      // Return something to ensure code ran
      return components.length;
    })
  `;

  const fn = vm.compileFunction(testCode, ['document', 'window'], {
    parsingContext: context,
  });
  fn(document, global);

  // Also compile ~100 modules (simulating module loading)
  for (let i = 0; i < 100; i++) {
    const code = `
      (function(module, exports, require) {
        class Component${i} {
          constructor(p) { this.props = p; this.state = { x: 0 }; }
          render() { return { type: 'div', props: this.props }; }
        }
        module.exports = Component${i};
      })
    `;
    vm.compileFunction(code, ['module', 'exports', 'require'], {
      parsingContext: context,
    });
  }

  // === TEARDOWN ===
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

  globalThis.gc();
}

// === Main ===
console.log("=== Cross-Context Reference GC Test ===\n");
console.log("Each iter: context + lazy-dom + execute DOM code + 100 modules + teardown + gc()\n");

const ITERATIONS = 200;

globalThis.gc();
await new Promise(r => setTimeout(r, 100));
globalThis.gc();
const baseline = process.memoryUsage();

for (let i = 0; i < ITERATIONS; i++) {
  runOneSuite();

  if ((i + 1) % 25 === 0) {
    await new Promise(r => setTimeout(r, 50));
    globalThis.gc();
    const m = process.memoryUsage();
    const heapGrowth = Math.round((m.heapUsed - baseline.heapUsed) / 1024 / 1024);
    console.log(`  suite=${i + 1}  heapGrowth=${heapGrowth}MB  heap=${Math.round(m.heapUsed/1024/1024)}MB`);
  }
}

for (let i = 0; i < 5; i++) {
  globalThis.gc();
  await new Promise(r => setTimeout(r, 200));
}

const final = process.memoryUsage();
const totalGrowth = Math.round((final.heapUsed - baseline.heapUsed) / 1024 / 1024);
console.log(`\nFinal: heapGrowth=${totalGrowth}MB  Rate=${(totalGrowth / ITERATIONS).toFixed(2)}MB/suite`);
