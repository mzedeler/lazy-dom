/**
 * Simulates what Jest does with vm contexts + ModuleMocker + FakeTimers
 * to identify which interaction causes memory retention.
 *
 * Usage: node --expose-gc packages/bench-pro/jest-sim-leak-test.mjs
 */

import vm from "vm"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const jestMockPath = "../../node_modules/.pnpm/jest-mock@29.7.0/node_modules/jest-mock/build/index.js"
const { ModuleMocker } = require(jestMockPath)

const ITERATIONS = 200

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1)
}

async function runTest(label, setup) {
  // Warmup
  for (let i = 0; i < 3; i++) {
    await setup()
  }
  if (global.gc) global.gc()
  await new Promise(r => setTimeout(r, 100))
  if (global.gc) global.gc()

  const before = process.memoryUsage()

  for (let i = 0; i < ITERATIONS; i++) {
    await setup()
    if (global.gc && (i + 1) % 50 === 0) {
      global.gc()
    }
  }

  if (global.gc) {
    global.gc()
    await new Promise(r => setTimeout(r, 100))
    global.gc()
  }

  const after = process.memoryUsage()
  const growth = after.heapUsed - before.heapUsed
  console.log(`  ${label}: +${mb(growth)} MB total, ${(growth / ITERATIONS / 1024).toFixed(1)} KB/iter`)
}

// Test 1: Context + ModuleMocker (NOT nulling _environmentGlobal)
await runTest("1. ctx + ModuleMocker (retained)", async () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  const mocker = new ModuleMocker(g)

  // Delete configurable props
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }
  // Simulate Runtime retaining mocker but nothing else
  // (mocker._environmentGlobal still points to g)
})

// Test 2: Context + ModuleMocker (nulling _environmentGlobal)
await runTest("2. ctx + ModuleMocker (nulled)", async () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  const mocker = new ModuleMocker(g)

  // Delete configurable props
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }

  Object.assign(mocker, { _environmentGlobal: null })
})

// Test 3: Context + ModuleMocker + non-configurable props (retained)
await runTest("3. ctx + noncfg + ModuleMocker (retained)", async () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  Object.defineProperty(g, Symbol.for('jest-native-promise'), {
    configurable: false, enumerable: false, value: g.Promise, writable: false,
  })
  Object.defineProperty(g, Symbol.for('jest-native-now'), {
    configurable: false, enumerable: false, value: g.Date.now.bind(g.Date), writable: false,
  })

  const mocker = new ModuleMocker(g)

  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }
  // mocker._environmentGlobal still points to g (not nulled)
})

// Test 4: Context + noncfg + ModuleMocker (nulled)
await runTest("4. ctx + noncfg + ModuleMocker (nulled)", async () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  Object.defineProperty(g, Symbol.for('jest-native-promise'), {
    configurable: false, enumerable: false, value: g.Promise, writable: false,
  })
  Object.defineProperty(g, Symbol.for('jest-native-now'), {
    configurable: false, enumerable: false, value: g.Date.now.bind(g.Date), writable: false,
  })

  const mocker = new ModuleMocker(g)

  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }

  Object.assign(mocker, { _environmentGlobal: null })
})

// Test 5: Context + code compilation + ModuleMocker (retained)
await runTest("5. ctx + code + ModuleMocker (retained)", async () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  // Simulate Jest module loading - compile code in context
  let code = ""
  for (let i = 0; i < 50; i++) {
    code += `var _mod${i} = (function(module, exports, require) {
      function Component${i}(props) { return { type: 'div', children: props.children }; }
      module.exports = Component${i};
    })({exports:{}},{},function(){});\n`
  }
  const script = new vm.Script(code)
  script.runInContext(ctx)

  Object.defineProperty(g, Symbol.for('jest-native-promise'), {
    configurable: false, enumerable: false, value: g.Promise, writable: false,
  })

  const mocker = new ModuleMocker(g)

  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }
  // mocker._environmentGlobal NOT nulled - simulates Runtime retention
})

// Test 6: Context + code + ModuleMocker (nulled) + gc
await runTest("6. ctx + code + ModuleMocker (nulled) + gc", async () => {
  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  let code = ""
  for (let i = 0; i < 50; i++) {
    code += `var _mod${i} = (function(module, exports, require) {
      function Component${i}(props) { return { type: 'div', children: props.children }; }
      module.exports = Component${i};
    })({exports:{}},{},function(){});\n`
  }
  const script = new vm.Script(code)
  script.runInContext(ctx)

  Object.defineProperty(g, Symbol.for('jest-native-promise'), {
    configurable: false, enumerable: false, value: g.Promise, writable: false,
  })

  const mocker = new ModuleMocker(g)

  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }

  Object.assign(mocker, { _environmentGlobal: null })
  if (global.gc) global.gc()
})

// Test 7: Simulate full Jest lifecycle (retained mocker like real Jest)
await runTest("7. Full Jest sim (mocker retained in outer scope)", async () => {
  // This simulates: Runtime creates mocker, teardowns happen, but Runtime
  // keeps _moduleMocker reference until runTestInternal returns
  let retainedMocker = null // Simulates Runtime._moduleMocker

  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  Object.defineProperty(g, Symbol.for('jest-native-promise'), {
    configurable: false, enumerable: false, value: g.Promise, writable: false,
  })

  const mocker = new ModuleMocker(g)
  retainedMocker = mocker // Runtime captures this

  // Compile code
  let code = ""
  for (let i = 0; i < 50; i++) {
    code += `var _mod${i} = (function(m,e,r){function C${i}(p){return p;}m.exports=C${i};})({},{},function(){});\n`
  }
  new vm.Script(code).runInContext(ctx)

  // Simulate Runtime.teardown() - clears some stuff but NOT _moduleMocker
  // (This is what happens in real Jest)

  // Simulate Environment.teardown()
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }

  // We null _environmentGlobal
  Object.assign(mocker, { _environmentGlobal: null })
  if (global.gc) global.gc()

  // After this, Runtime goes out of scope → retainedMocker becomes unreachable
  retainedMocker = null
})

// Test 8: Same but WITHOUT nulling _environmentGlobal
await runTest("8. Full Jest sim (mocker retained, NOT nulled)", async () => {
  let retainedMocker = null

  const ctx = vm.createContext()
  const g = vm.runInContext("this", ctx)

  Object.defineProperty(g, Symbol.for('jest-native-promise'), {
    configurable: false, enumerable: false, value: g.Promise, writable: false,
  })

  const mocker = new ModuleMocker(g)
  retainedMocker = mocker

  let code = ""
  for (let i = 0; i < 50; i++) {
    code += `var _mod${i} = (function(m,e,r){function C${i}(p){return p;}m.exports=C${i};})({},{},function(){});\n`
  }
  new vm.Script(code).runInContext(ctx)

  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc?.configurable) {
      try { delete g[key] } catch {}
    }
  }

  // DON'T null _environmentGlobal
  if (global.gc) global.gc()

  retainedMocker = null
})
