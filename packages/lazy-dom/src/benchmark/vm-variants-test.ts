/**
 * Isolate which aspect of vm.createContext() causes memory growth with lazy-dom.
 * Tests:
 * 1. vm + lazy-dom + unique scripts (current behavior) 
 * 2. vm + lazy-dom + same script each time
 * 3. vm + lazy-dom + no scripts (just context creation + DOM setup)
 * 4. vm + no DOM + unique scripts (= plain-vm from compare)
 */
import vm from 'node:vm'
import lazyDom, { reset } from '../lazyDom'

const ITERATIONS = 500
const MODULES_PER_ITER = 10

function makeTestModule(index: number): string {
  return `
(function() {
  var root = document.createElement('div');
  root.id = 'root-' + ${index};
  document.body.appendChild(root);
  for (var i = 0; i < 10; i++) {
    var section = document.createElement('section');
    section.className = 'section-' + i;
    var heading = document.createElement('h2');
    heading.textContent = 'Section ' + i;
    section.appendChild(heading);
    var list = document.createElement('ul');
    for (var j = 0; j < 5; j++) {
      var li = document.createElement('li');
      li.textContent = 'Item ' + j;
      li.setAttribute('data-index', '' + j);
      var button = document.createElement('button');
      button.textContent = 'Action ' + j;
      button.addEventListener('click', function handler(e) {
        li.textContent = 'Clicked: ' + e.type;
        return section.className;
      });
      li.appendChild(button);
      list.appendChild(li);
    }
    section.appendChild(list);
    root.appendChild(section);
  }
  var html = root.innerHTML;
  var items = document.querySelectorAll('li');
  return { htmlLen: html.length, itemCount: items.length };
})()
`
}

const STATIC_MODULE = makeTestModule(0)

async function gcAsync(): Promise<void> {
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
}

type TestFn = () => Promise<number>

async function runTest(label: string, fn: TestFn): Promise<void> {
  await gcAsync()
  const start = process.memoryUsage()
  const growth = await fn()
  await gcAsync()
  const end = process.memoryUsage()
  const startH = Math.round(start.heapUsed / 1024 / 1024)
  const endH = Math.round(end.heapUsed / 1024 / 1024)
  console.log(`${label.padEnd(50)} heapUsed: ${startH} -> ${endH} MB (+${endH - startH})`)
}

function setupContext(): { context: vm.Context; g: Record<string, unknown> } {
  const context = vm.createContext()
  const g = vm.runInContext('this', context) as Record<string, unknown>
  const { document, classes } = lazyDom()
  for (const [name, value] of Object.entries(classes)) {
    g[name] = value
  }
  g.document = document
  g.window = g
  return { context, g }
}

async function main() {
  console.log('=== VM Context Memory Growth Variants (500 iters, 10 modules/iter) ===\n')
  
  // Test 1: vm + lazy-dom + unique scripts (current behavior)
  await runTest('1. vm + lazy-dom + UNIQUE scripts', async () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { context } = setupContext()
      for (let j = 0; j < MODULES_PER_ITER; j++) {
        new vm.Script(makeTestModule(i * MODULES_PER_ITER + j), {
          filename: `test-${i}-mod-${j}.js`,
        }).runInContext(context)
      }
      reset()
    }
    return 0
  })

  // Test 2: vm + lazy-dom + same script source each time (static)
  await runTest('2. vm + lazy-dom + STATIC script (same source)', async () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { context } = setupContext()
      for (let j = 0; j < MODULES_PER_ITER; j++) {
        new vm.Script(STATIC_MODULE, {
          filename: 'static-test.js',
        }).runInContext(context)
      }
      reset()
    }
    return 0
  })

  // Test 3: vm + lazy-dom + no scripts (just context + DOM setup)
  await runTest('3. vm + lazy-dom + NO scripts (setup only)', async () => {
    for (let i = 0; i < ITERATIONS; i++) {
      setupContext()
      reset()
    }
    return 0
  })

  // Test 4: vm + no DOM + unique scripts
  await runTest('4. vm + NO DOM + unique scripts', async () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const context = vm.createContext()
      for (let j = 0; j < MODULES_PER_ITER; j++) {
        const code = `(function() {
          var results = [];
          for (var i = 0; i < 100; i++) {
            var obj = { id: ${i * MODULES_PER_ITER + j} * 100 + i, data: 'item-' + i };
            var getter = (function(o) { return function() { return o.data; }; })(obj);
            results.push(getter);
          }
          return results.length;
        })()`
        new vm.Script(code, {
          filename: `plain-${i}-mod-${j}.js`,
        }).runInContext(context)
      }
    }
    return 0
  })

  // Test 5: vm + lazy-dom + unique scripts + neuter context
  await runTest('5. vm + lazy-dom + UNIQUE scripts + NEUTER ctx', async () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { context, g } = setupContext()
      for (let j = 0; j < MODULES_PER_ITER; j++) {
        new vm.Script(makeTestModule(i * MODULES_PER_ITER + j), {
          filename: `test-${i}-mod-${j}.js`,
        }).runInContext(context)
      }
      reset()
      for (const key of Object.getOwnPropertyNames(g)) {
        const desc = Object.getOwnPropertyDescriptor(g, key)
        if (desc && desc.configurable) {
          delete g[key]
        }
      }
    }
    return 0
  })

  // Test 6: no vm, just lazy-dom DOM ops (baseline)
  await runTest('6. NO vm + lazy-dom DOM ops (baseline)', async () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { document } = lazyDom()
      ;(globalThis as Record<string, unknown>).document = document
      for (let j = 0; j < MODULES_PER_ITER; j++) {
        const fn = new Function(makeTestModule(i * MODULES_PER_ITER + j).replace(/^\(function\(\) \{/, '').replace(/\}\)\(\)\s*$/, ''))
        fn()
      }
      delete (globalThis as Record<string, unknown>).document
      reset()
    }
    return 0
  })
}

main().catch(console.error)
