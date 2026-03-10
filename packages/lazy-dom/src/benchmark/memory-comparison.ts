/**
 * Memory comparison: lazy-dom vs JSDOM vm context lifecycle.
 *
 * Simulates what jest does with --runInBand: for each "test file",
 * creates a vm context, installs DOM globals, compiles and runs
 * test code, then tears down. Measures memory after each batch
 * to show whether memory grows monotonically or plateaus.
 *
 * Usage:
 *   cd packages/lazy-dom
 *   npx tsx --expose-gc src/benchmark/memory-comparison.ts <mode> [iterations]
 *
 * Modes:
 *   lazy           lazy-dom with reset() only (current behavior)
 *   lazy-neutered  lazy-dom with reset() + delete all context properties
 *   lazy-close     lazy-dom with body.innerHTML="" + reset() (tests DOM cleanup)
 *   jsdom          JSDOM with window.close()
 *   plain-vm       no DOM — plain vm contexts with compiled code (V8 baseline)
 *
 * Run all four for comparison (each in its own process to avoid
 * cross-contamination):
 *
 *   for mode in lazy lazy-close lazy-neutered jsdom plain-vm; do
 *     echo ""; echo "=== $mode ==="
 *     npx tsx --expose-gc src/benchmark/memory-comparison.ts $mode 500
 *   done
 */
import vm from 'node:vm'
import { writeHeapSnapshot } from 'node:v8'
import { execFileSync } from 'node:child_process'
import lazyDom, { reset } from '../lazyDom'

type Mode = 'lazy' | 'lazy-neutered' | 'lazy-close' | 'jsdom' | 'plain-vm' | 'compare'
const VALID_MODES: Mode[] = ['lazy', 'lazy-neutered', 'lazy-close', 'jsdom', 'plain-vm', 'compare']
const MODE = process.argv[2] as Mode | undefined
const ITERATIONS = parseInt(process.argv[3] || '100')
const REPORT_INTERVAL = 10
const MODULES_PER_ITER = 10

if (!MODE || !VALID_MODES.includes(MODE)) {
  console.error('Usage: npx tsx --expose-gc src/benchmark/memory-comparison.ts <lazy|lazy-close|lazy-neutered|jsdom|plain-vm|compare> [iterations]')
  process.exit(1)
}

if (MODE !== 'compare' && !global.gc) {
  console.error('ERROR: Run with --expose-gc')
  console.error('  npx tsx --expose-gc src/benchmark/memory-comparison.ts ...')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Workload: generates a test module that creates DOM structures with
// closures capturing local DOM node references — the pattern that creates
// reference cycles keeping vm contexts alive.
// ---------------------------------------------------------------------------
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
      // Closure captures li and section — local DOM node references
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

  // Force lazy evaluation
  var html = root.innerHTML;
  var items = document.querySelectorAll('li');

  // More closures capturing DOM references
  var getters = [];
  for (var k = 0; k < items.length; k++) {
    (function(item) {
      getters.push(function() { return item.textContent; });
    })(items[k]);
  }

  return { htmlLen: html.length, itemCount: items.length };
})()
`
}

// ---------------------------------------------------------------------------
// Memory measurement helpers
// ---------------------------------------------------------------------------
async function gcAsync(): Promise<void> {
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
}

interface MemSample {
  iter: number
  rss: number
  heapUsed: number
  heapTotal: number
}

function measure(iter: number): MemSample {
  const mem = process.memoryUsage()
  return {
    iter,
    rss: Math.round(mem.rss / 1024 / 1024),
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
  }
}

// ---------------------------------------------------------------------------
// Mode: lazy-dom with reset() (current jest environment behavior)
// ---------------------------------------------------------------------------
async function runLazy(iterations: number): Promise<MemSample[]> {
  const samples: MemSample[] = []

  await gcAsync()
  const snapBefore = writeHeapSnapshot('lazy-dom-before.heapsnapshot')
  console.log(`Heap snapshot (before): ${snapBefore}`)

  for (let i = 0; i < iterations; i++) {
    // --- Setup (mirrors LazyDomEnvironment constructor) ---
    const context = vm.createContext()
    const g = vm.runInContext('this', context) as Record<string, unknown>

    const { window, document, classes } = lazyDom()
    for (const [name, value] of Object.entries(classes)) {
      g[name] = value
    }
    g.document = document
    g.window = g  // browser convention: window === globalThis

    // --- Compile & run test modules (simulates jest module compilation) ---
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      const script = new vm.Script(makeTestModule(i * MODULES_PER_ITER + j), {
        filename: `test-${i}-mod-${j}.js`,
      })
      script.runInContext(context)
    }

    // --- Teardown (mirrors LazyDomEnvironment.teardown) ---
    reset()
    // context goes out of scope — no way to neuter it from outside

    // --- Measure ---
    if (i % REPORT_INTERVAL === 0 || i === iterations - 1) {
      await gcAsync()
      samples.push(measure(i))
    }
  }

  await gcAsync()
  const snapAfter = writeHeapSnapshot('lazy-dom-after.heapsnapshot')
  console.log(`Heap snapshot (after):  ${snapAfter}`)

  return samples
}

// ---------------------------------------------------------------------------
// Mode: lazy-dom with body.innerHTML="" + reset().
// Clears the DOM tree before resetting, breaking the reference chain:
//   context → document → body → children → event listeners → closures
// This tests whether JSDOM-style DOM cleanup alone is sufficient.
// ---------------------------------------------------------------------------
async function runLazyClose(iterations: number): Promise<MemSample[]> {
  const samples: MemSample[] = []
  const cleanupScript = new vm.Script(
    'if (document && document.body) document.body.innerHTML = "";',
    { filename: 'teardown-cleanup.js' }
  )

  for (let i = 0; i < iterations; i++) {
    // --- Setup ---
    const context = vm.createContext()
    const g = vm.runInContext('this', context) as Record<string, unknown>

    const { window, document, classes } = lazyDom()
    for (const [name, value] of Object.entries(classes)) {
      g[name] = value
    }
    g.document = document
    g.window = g

    // --- Compile & run ---
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      const script = new vm.Script(makeTestModule(i * MODULES_PER_ITER + j), {
        filename: `test-${i}-mod-${j}.js`,
      })
      script.runInContext(context)
    }

    // --- Teardown: clear DOM body, then reset ---
    // Clear body.innerHTML BEFORE reset() so the WASM layer is still intact
    // for removeChild operations. This orphans all DOM nodes, making their
    // event listener closures unreachable from the context global.
    cleanupScript.runInContext(context)
    reset()

    // --- Measure ---
    if (i % REPORT_INTERVAL === 0 || i === iterations - 1) {
      await gcAsync()
      samples.push(measure(i))
    }
  }

  return samples
}

// ---------------------------------------------------------------------------
// Mode: lazy-dom with reset() + delete all configurable context properties.
// In a real jest env, this crashes stale async callbacks. In this synthetic
// test, there are none, so we can see the memory effect in isolation.
// ---------------------------------------------------------------------------
async function runLazyNeutered(iterations: number): Promise<MemSample[]> {
  const samples: MemSample[] = []

  for (let i = 0; i < iterations; i++) {
    // --- Setup ---
    const context = vm.createContext()
    const g = vm.runInContext('this', context) as Record<string, unknown>

    const { window, document, classes } = lazyDom()
    for (const [name, value] of Object.entries(classes)) {
      g[name] = value
    }
    g.document = document
    g.window = g

    // --- Compile & run ---
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      const script = new vm.Script(makeTestModule(i * MODULES_PER_ITER + j), {
        filename: `test-${i}-mod-${j}.js`,
      })
      script.runInContext(context)
    }

    // --- Teardown: reset + neuter context ---
    reset()

    // Neuter: delete all configurable properties from the context global.
    // This breaks the reference chain: context → document → DOM tree →
    // event listeners → closures → local vars, allowing V8 to GC the
    // compiled code objects that reference this context.
    for (const key of Object.getOwnPropertyNames(g)) {
      const desc = Object.getOwnPropertyDescriptor(g, key)
      if (desc && desc.configurable) {
        delete g[key]
      }
    }

    // --- Measure ---
    if (i % REPORT_INTERVAL === 0 || i === iterations - 1) {
      await gcAsync()
      samples.push(measure(i))
    }
  }

  return samples
}

// ---------------------------------------------------------------------------
// Mode: JSDOM with window.close() (what jest-environment-jsdom does)
// ---------------------------------------------------------------------------
async function runJsdom(iterations: number): Promise<MemSample[]> {
  // Dynamic import so the script doesn't fail if jsdom isn't installed
  const { JSDOM } = await import('jsdom')
  const samples: MemSample[] = []

  await gcAsync()
  const snapBefore = writeHeapSnapshot('jsdom-before.heapsnapshot')
  console.log(`Heap snapshot (before): ${snapBefore}`)

  for (let i = 0; i < iterations; i++) {
    // --- Setup (mirrors jest-environment-jsdom) ---
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      url: 'http://localhost',
    })

    // --- Run test modules in JSDOM's context ---
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      dom.window.eval(makeTestModule(i * MODULES_PER_ITER + j))
    }

    // --- Teardown (mirrors jest-environment-jsdom) ---
    dom.window.close()

    // --- Measure ---
    if (i % REPORT_INTERVAL === 0 || i === iterations - 1) {
      await gcAsync()
      samples.push(measure(i))
    }
  }

  await gcAsync()
  const snapAfter = writeHeapSnapshot('jsdom-after.heapsnapshot')
  console.log(`Heap snapshot (after):  ${snapAfter}`)

  return samples
}

// ---------------------------------------------------------------------------
// Mode: plain vm contexts with no DOM at all.
// Isolates whether memory growth comes from V8's context/compiled-code
// retention or from lazy-dom's objects.
// ---------------------------------------------------------------------------
function makePlainModule(index: number): string {
  return `
(function() {
  var results = [];
  for (var i = 0; i < 100; i++) {
    var obj = { id: ${index} * 100 + i, data: 'item-' + i };
    var getter = (function(o) { return function() { return o.data; }; })(obj);
    results.push(getter);
  }
  return results.length;
})()
`
}

async function runPlainVm(iterations: number): Promise<MemSample[]> {
  const samples: MemSample[] = []

  await gcAsync()
  const snapBefore = writeHeapSnapshot('plain-vm-before.heapsnapshot')
  console.log(`Heap snapshot (before): ${snapBefore}`)

  for (let i = 0; i < iterations; i++) {
    const context = vm.createContext()

    // Compile & run the same number of modules, but with no DOM
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      const script = new vm.Script(makePlainModule(i * MODULES_PER_ITER + j), {
        filename: `plain-${i}-mod-${j}.js`,
      })
      script.runInContext(context)
    }

    // No teardown needed — context goes out of scope

    if (i % REPORT_INTERVAL === 0 || i === iterations - 1) {
      await gcAsync()
      samples.push(measure(i))
    }
  }

  await gcAsync()
  const snapAfter = writeHeapSnapshot('plain-vm-after.heapsnapshot')
  console.log(`Heap snapshot (after):  ${snapAfter}`)

  return samples
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
function printTable(label: string, samples: MemSample[]) {
  console.log(`\n=== ${label} (${ITERATIONS} iterations, ${MODULES_PER_ITER} modules/iter) ===`)
  console.log('')
  console.log('| iter | RSS (MB) | heapUsed (MB) | heapTotal (MB) |')
  console.log('|------|----------|---------------|----------------|')
  for (const s of samples) {
    console.log(
      `| ${String(s.iter).padStart(4)} ` +
      `| ${String(s.rss).padStart(8)} ` +
      `| ${String(s.heapUsed).padStart(13)} ` +
      `| ${String(s.heapTotal).padStart(14)} |`
    )
  }
  const first = samples[0]
  const last = samples[samples.length - 1]
  console.log('')
  console.log(`Growth: RSS ${first.rss} → ${last.rss} MB (+${last.rss - first.rss}), ` +
    `heapUsed ${first.heapUsed} → ${last.heapUsed} MB (+${last.heapUsed - first.heapUsed})`)
}

// ---------------------------------------------------------------------------
// Compare mode: runs jsdom, plain-vm, lazy in separate child processes
// and prints a summary table.
// ---------------------------------------------------------------------------
interface CompareResult {
  mode: string
  heapGrowth: number
  rate: string
}

function runModeInChild(mode: string, iterations: number): string {
  const scriptPath = new URL(import.meta.url).pathname
  const output = execFileSync(
    process.execPath,
    ['--expose-gc', '--import', 'tsx', scriptPath, mode, String(iterations)],
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] }
  )
  return output
}

function parseGrowth(output: string): number {
  const match = output.match(/heapUsed \d+ → \d+ MB \(\+(\d+)\)/)
  return match ? parseInt(match[1]) : -1
}

function runCompare(iterations: number): void {
  const modes: Array<{ key: string; label: string }> = [
    { key: 'jsdom', label: 'jsdom' },
    { key: 'plain-vm', label: 'plain-vm' },
    { key: 'lazy', label: 'lazy' },
  ]

  console.log(`Running memory comparison (${iterations} iterations, ${MODULES_PER_ITER} modules/iter)`)
  console.log('')

  const results: CompareResult[] = []
  for (const { key, label } of modes) {
    process.stderr.write(`  Running ${label}...`)
    const output = runModeInChild(key, iterations)
    const growth = parseGrowth(output)
    const rate = (growth / iterations).toFixed(3)
    results.push({ mode: label, heapGrowth: growth, rate })
    process.stderr.write(` +${growth} MB\n`)
  }

  console.log('')
  console.log('Mode              | heapUsed growth | Rate (MB/iter)')
  console.log('------------------|-----------------|---------------')
  for (const r of results) {
    console.log(
      `${r.mode.padEnd(18)}| +${String(r.heapGrowth).padStart(3)} MB${' '.repeat(10)}| ${r.rate}`
    )
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (MODE === 'compare') {
    runCompare(ITERATIONS)
    return
  }

  console.log(`Mode: ${MODE}, Iterations: ${ITERATIONS}, Modules/iter: ${MODULES_PER_ITER}`)

  await gcAsync()

  let samples: MemSample[]
  switch (MODE) {
    case 'lazy':
      samples = await runLazy(ITERATIONS)
      printTable('lazy-dom (reset only)', samples)
      break
    case 'lazy-close':
      samples = await runLazyClose(ITERATIONS)
      printTable('lazy-dom (clear body + reset)', samples)
      break
    case 'lazy-neutered':
      samples = await runLazyNeutered(ITERATIONS)
      printTable('lazy-dom (reset + neuter context)', samples)
      break
    case 'jsdom':
      samples = await runJsdom(ITERATIONS)
      printTable('JSDOM (window.close)', samples)
      break
    case 'plain-vm':
      samples = await runPlainVm(ITERATIONS)
      printTable('plain vm (no DOM)', samples)
      break
  }
}

main().catch(console.error)
