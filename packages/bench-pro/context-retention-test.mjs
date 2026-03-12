/**
 * VM Context Retention Diagnostic
 *
 * Compares two styles of vm.createContext() usage to understand how V8
 * retains contexts differently:
 *
 *   Approach A ("lazy-dom style"):
 *     vm.createContext() on a fresh empty context, then assign properties
 *     onto the context global afterwards + compile ~50 modules with
 *     vm.compileFunction.
 *
 *   Approach B ("JSDOM style"):
 *     Build an object with properties first, then pass it to
 *     vm.createContext(someObject) so the object becomes the global.
 *
 * Each approach:
 *   1. Creates 200 contexts in a loop
 *   2. Nulls all references after each
 *   3. After all 200, calls gc() 5 times with delays
 *   4. Measures how many contexts are alive via WeakRef
 *   5. Reports memory usage
 *
 * Usage:
 *   node --expose-gc packages/bench-pro/context-retention-test.mjs
 */

import vm from "node:vm";

if (typeof globalThis.gc !== "function") {
  console.error("ERROR: Must run with --expose-gc");
  console.error("  node --expose-gc packages/bench-pro/context-retention-test.mjs");
  process.exit(1);
}

const ITERATIONS = 200;
const MODULES_PER_CONTEXT = 50;
const GC_ROUNDS = 5;
const GC_DELAY_MS = 100;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

/**
 * Generate a module-sized chunk of code similar to a React component file.
 * Each module is a self-contained IIFE that creates a class with methods.
 */
function makeModuleCode(index) {
  return `
    (function(module, exports, require) {
      'use strict';
      class Component${index} {
        constructor(props) {
          this.props = props;
          this.state = { count: 0, items: [], loading: false };
        }
        setState(update) {
          this.state = Object.assign(
            {},
            this.state,
            typeof update === 'function' ? update(this.state) : update
          );
        }
        render() {
          return {
            type: 'div',
            props: { className: 'c${index}' },
            children: this.state.items.map(function(item, i) {
              return { type: 'span', props: { key: i }, children: [item] };
            })
          };
        }
      }
      module.exports = Component${index};
    })
  `;
}

/**
 * Compile N modules into a vm context using vm.compileFunction, which is
 * the mechanism Jest uses to load modules into sandboxed contexts.
 */
function compileModulesInContext(context, count) {
  for (let i = 0; i < count; i++) {
    vm.compileFunction(makeModuleCode(i), ["module", "exports", "require"], {
      parsingContext: context,
    });
  }
}

/**
 * Assign typical environment properties onto a global object.
 * This mirrors what jest-environment-lazy-dom and jest-environment-jsdom
 * both do after context creation.
 */
function assignEnvironmentProperties(global) {
  // Node.js builtins
  global.global = global;
  global.Buffer = Buffer;
  global.ArrayBuffer = ArrayBuffer;
  global.Uint8Array = Uint8Array;
  global.setTimeout = globalThis.setTimeout;
  global.clearTimeout = globalThis.clearTimeout;
  global.setInterval = globalThis.setInterval;
  global.clearInterval = globalThis.clearInterval;
  global.console = console;
  global.process = process;
  global.Promise = Promise;
  global.Date = Date;
  global.Symbol = Symbol;
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  global.URL = URL;
  global.URLSearchParams = URLSearchParams;

  // Non-configurable properties (installCommonGlobals does this)
  Object.defineProperty(global, Symbol.for("jest-native-promise"), {
    configurable: false,
    writable: false,
    value: Promise,
  });
  Object.defineProperty(global, Symbol.for("jest-native-now"), {
    configurable: false,
    writable: false,
    value: Date.now,
  });

  // Fake DOM-ish stubs (stand-ins for the real DOM classes)
  for (let i = 0; i < 30; i++) {
    Object.defineProperty(global, `DOMClass${i}`, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: class DummyDOMClass {},
    });
  }

  // document stub
  Object.defineProperty(global, "document", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: { createElement: () => ({}), body: {} },
  });
}

/**
 * Tear down a context global: delete all configurable properties and symbols.
 */
function teardownGlobal(global) {
  for (const key of Object.getOwnPropertyNames(global)) {
    const desc = Object.getOwnPropertyDescriptor(global, key);
    if (desc?.configurable) {
      try {
        delete global[key];
      } catch {}
    }
  }
  for (const sym of Object.getOwnPropertySymbols(global)) {
    const desc = Object.getOwnPropertyDescriptor(global, sym);
    if (desc?.configurable) {
      try {
        delete global[sym];
      } catch {}
    }
  }
}

/**
 * Force GC multiple rounds with delays to allow weak ref processing.
 */
async function forceGC(rounds, delayMs) {
  for (let i = 0; i < rounds; i++) {
    globalThis.gc();
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

// ---------------------------------------------------------------------------
// Approach A: lazy-dom style (plain vm.createContext() + assign after)
// ---------------------------------------------------------------------------

async function runApproachA() {
  const weakRefs = [];

  for (let i = 0; i < ITERATIONS; i++) {
    // 1. Create a plain context (no sandbox object passed in)
    const context = vm.createContext();
    const global = vm.runInContext("this", context);

    // 2. Assign environment properties onto the global
    assignEnvironmentProperties(global);

    // 3. Compile modules (simulates Jest loading ~50 modules)
    compileModulesInContext(context, MODULES_PER_CONTEXT);

    // 4. Track the global with a WeakRef
    weakRefs.push(new WeakRef(global));

    // 5. Tear down: delete properties, null references
    teardownGlobal(global);

    // All local references (context, global) go out of scope here
  }

  return weakRefs;
}

// ---------------------------------------------------------------------------
// Approach B: JSDOM style (vm.createContext(existingObject))
// ---------------------------------------------------------------------------

async function runApproachB() {
  const weakRefs = [];

  for (let i = 0; i < ITERATIONS; i++) {
    // 1. Build the sandbox object first with properties
    const sandbox = {};
    assignEnvironmentProperties(sandbox);

    // 2. Contextify the pre-built object (JSDOM's approach)
    const context = vm.createContext(sandbox);

    // 3. Compile modules
    compileModulesInContext(context, MODULES_PER_CONTEXT);

    // 4. Track with a WeakRef (sandbox === context after contextify)
    weakRefs.push(new WeakRef(sandbox));

    // 5. Tear down
    teardownGlobal(sandbox);
  }

  return weakRefs;
}

// ---------------------------------------------------------------------------
// Approach C: Plain vm.createContext() with NO module compilation
// ---------------------------------------------------------------------------

async function runApproachC() {
  const weakRefs = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const context = vm.createContext();
    const global = vm.runInContext("this", context);
    assignEnvironmentProperties(global);

    // NO module compilation

    weakRefs.push(new WeakRef(global));
    teardownGlobal(global);
  }

  return weakRefs;
}

// ---------------------------------------------------------------------------
// Approach D: Plain vm.createContext() with module compilation but NO properties
// ---------------------------------------------------------------------------

async function runApproachD() {
  const weakRefs = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const context = vm.createContext();
    const global = vm.runInContext("this", context);

    // NO properties assigned

    compileModulesInContext(context, MODULES_PER_CONTEXT);

    weakRefs.push(new WeakRef(global));
    // No teardown needed since no properties assigned
  }

  return weakRefs;
}

// ---------------------------------------------------------------------------
// Approach E: Empty vm.createContext() - absolute minimum
// ---------------------------------------------------------------------------

async function runApproachE() {
  const weakRefs = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const context = vm.createContext();
    const global = vm.runInContext("this", context);
    weakRefs.push(new WeakRef(global));
  }

  return weakRefs;
}

// ---------------------------------------------------------------------------
// Run all approaches and report
// ---------------------------------------------------------------------------

async function runAndReport(label, fn) {
  // Warmup: run 3 iterations to warm JIT
  const warmupWeakRefs = [];
  for (let i = 0; i < 3; i++) {
    const context = vm.createContext();
    warmupWeakRefs.push(new WeakRef(vm.runInContext("this", context)));
  }
  await forceGC(3, 50);

  const memBefore = process.memoryUsage();
  const weakRefs = await fn();
  const memAfterCreate = process.memoryUsage();

  // Force GC multiple rounds
  await forceGC(GC_ROUNDS, GC_DELAY_MS);

  const memAfterGC = process.memoryUsage();

  const alive = weakRefs.filter((wr) => wr.deref() !== undefined).length;
  const collected = ITERATIONS - alive;
  const heapGrowthTotal = memAfterCreate.heapUsed - memBefore.heapUsed;
  const heapAfterGC = memAfterGC.heapUsed - memBefore.heapUsed;

  console.log(`\n--- ${label} ---`);
  console.log(`  Contexts created:  ${ITERATIONS}`);
  console.log(`  Still alive:       ${alive} / ${ITERATIONS}`);
  console.log(`  Collected:         ${collected} / ${ITERATIONS}`);
  console.log(`  Retention rate:    ${((alive / ITERATIONS) * 100).toFixed(1)}%`);
  console.log(`  Heap growth (before GC): +${mb(heapGrowthTotal)} MB  (${(heapGrowthTotal / ITERATIONS / 1024).toFixed(1)} KB/ctx)`);
  console.log(`  Heap growth (after GC):  +${mb(heapAfterGC)} MB  (${(heapAfterGC / ITERATIONS / 1024).toFixed(1)} KB/ctx)`);

  return { label, alive, collected, heapGrowthTotal, heapAfterGC };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("=== VM Context Retention Diagnostic ===");
console.log(`  Iterations: ${ITERATIONS}`);
console.log(`  Modules per context: ${MODULES_PER_CONTEXT}`);
console.log(`  GC rounds: ${GC_ROUNDS} (${GC_DELAY_MS}ms delay each)`);
console.log(`  Node.js: ${process.version}`);
console.log(`  V8: ${process.versions.v8}`);

// Clean slate
await forceGC(3, 100);

const results = [];

results.push(await runAndReport(
  "A: lazy-dom style (plain createContext + assign + compile)",
  runApproachA
));

// Clean slate between approaches
await forceGC(5, 100);

results.push(await runAndReport(
  "B: JSDOM style (createContext(existingObj) + compile)",
  runApproachB
));

await forceGC(5, 100);

results.push(await runAndReport(
  "C: createContext + assign, NO module compilation",
  runApproachC
));

await forceGC(5, 100);

results.push(await runAndReport(
  "D: createContext + compile, NO property assignment",
  runApproachD
));

await forceGC(5, 100);

results.push(await runAndReport(
  "E: Empty createContext (absolute minimum)",
  runApproachE
));

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log("\n\n========== SUMMARY ==========");
console.log("Approach                                                Alive   Collected   Retention");
console.log("------------------------------------------------------------------------------------");
for (const r of results) {
  const line = r.label.padEnd(56) +
    `${r.alive}`.padStart(5) +
    `${r.collected}`.padStart(12) +
    `${((r.alive / ITERATIONS) * 100).toFixed(1)}%`.padStart(12);
  console.log(line);
}

const finalMem = process.memoryUsage();
console.log(`\nFinal memory: heap=${mb(finalMem.heapUsed)} MB, rss=${mb(finalMem.rss)} MB`);
