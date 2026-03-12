/**
 * Measures the base cost of vm.createContext() + teardown to understand
 * how much memory each context retains after teardown.
 *
 * Tests multiple scenarios:
 * 1. Empty context (just vm.createContext())
 * 2. Context with properties (simulating our environment)
 * 3. Context with code compilation (simulating Jest module loading)
 * 4. Context with non-configurable properties (simulating installCommonGlobals)
 *
 * Usage: node --expose-gc packages/bench-pro/vm-context-leak-test.mjs
 */

import vm from "vm"

const ITERATIONS = 200

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1)
}

function runTest(label, setup) {
  // Warmup
  for (let i = 0; i < 5; i++) {
    setup()
  }
  if (global.gc) global.gc()

  const before = process.memoryUsage()

  for (let i = 0; i < ITERATIONS; i++) {
    setup()
    if (global.gc && (i + 1) % 50 === 0) {
      global.gc()
    }
  }

  if (global.gc) {
    global.gc()
    await_setImmediate()
    global.gc()
  }

  const after = process.memoryUsage()
  const growth = after.heapUsed - before.heapUsed
  console.log(`  ${label}: +${mb(growth)} MB total, ${(growth / ITERATIONS / 1024).toFixed(1)} KB/iter`)
}

// Helper for async delay
function await_setImmediate() {
  // Sync version - just yield to allow finalization
  const start = Date.now()
  while (Date.now() - start < 50) {} // spin wait 50ms
}

// Test 1: Empty context - just create and null
runTest("1. Empty context", () => {
  let ctx = vm.createContext()
  ctx = null
})

// Test 2: Context with many properties added then deleted
runTest("2. Context + props deleted", () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  // Add 100 configurable properties
  for (let i = 0; i < 100; i++) {
    Object.defineProperty(g, `prop${i}`, {
      configurable: true,
      value: { data: `value${i}` },
      writable: true,
    })
  }

  // Delete all
  for (let i = 0; i < 100; i++) {
    delete g[`prop${i}`]
  }
})

// Test 3: Context with code compilation
runTest("3. Context + code compilation", () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  // Compile some code in the context (simulates loading modules)
  const script = new vm.Script(`
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    fibonacci(10);

    class MyClass {
      constructor(x) { this.x = x; }
      method() { return this.x * 2; }
    }
    new MyClass(42).method();
  `)
  script.runInContext(ctx)

  // Delete configurable props
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }
})

// Test 4: Context with non-configurable properties (like installCommonGlobals)
runTest("4. Context + non-configurable props", () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  // Simulate installCommonGlobals non-configurable properties
  Object.defineProperty(g, Symbol.for('test-native-promise'), {
    configurable: false,
    enumerable: false,
    value: g.Promise,
    writable: false,
  })
  Object.defineProperty(g, Symbol.for('test-native-now'), {
    configurable: false,
    enumerable: false,
    value: g.Date.now.bind(g.Date),
    writable: false,
  })

  // Delete configurable props
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }
})

// Test 5: Context with LARGE code compilation (simulates loading React)
runTest("5. Context + large code compilation", () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  // Generate a large script to simulate module loading
  let code = ""
  for (let i = 0; i < 100; i++) {
    code += `
      var _class${i} = (function() {
        function Class${i}(props) {
          this.props = props;
          this.state = {};
        }
        Class${i}.prototype.render = function() {
          return { type: 'div', props: this.props };
        };
        Class${i}.prototype.setState = function(newState) {
          Object.assign(this.state, newState);
          this.render();
        };
        return Class${i};
      })();
    `
  }

  const script = new vm.Script(code)
  script.runInContext(ctx)

  // Delete configurable props
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }
})

// Test 6: Context with non-configurable + code compilation + gc between
runTest("6. Context + noncfg + code + gc", () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  // Non-configurable props
  Object.defineProperty(g, Symbol.for('test-native-promise'), {
    configurable: false, enumerable: false,
    value: g.Promise, writable: false,
  })

  // Large code compilation
  let code = ""
  for (let i = 0; i < 50; i++) {
    code += `var _c${i} = function(x) { return x * ${i}; };\n`
  }
  const script = new vm.Script(code)
  script.runInContext(ctx)

  // Delete configurable
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }

  if (global.gc) global.gc()
})

// Test 7: Same as 6 but WITHOUT non-configurable props
runTest("7. Context + code + gc (no noncfg)", () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  // NO non-configurable props

  // Large code compilation
  let code = ""
  for (let i = 0; i < 50; i++) {
    code += `var _c${i} = function(x) { return x * ${i}; };\n`
  }
  const script = new vm.Script(code)
  script.runInContext(ctx)

  // Delete configurable
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }

  if (global.gc) global.gc()
})
