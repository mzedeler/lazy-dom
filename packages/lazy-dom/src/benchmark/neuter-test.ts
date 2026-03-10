/**
 * Test neutering (deleting context global properties) in isolation.
 * Confirms whether breaking the global→document reference chain helps
 * when vm.Script is used.
 */
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import lazyDom, { reset } from '../lazyDom'

type Mode = 'lazy-default' | 'lazy-neuter-before-reset' | 'lazy-neuter-after-reset' | 'lazy-neuter-only' | 'compare'
const MODE = process.argv[2] as Mode
const ITERATIONS = parseInt(process.argv[3] || '500')
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

async function gcAsync(): Promise<void> {
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
}

function neuterContext(g: Record<string, unknown>): void {
  for (const key of Object.getOwnPropertyNames(g)) {
    const desc = Object.getOwnPropertyDescriptor(g, key)
    if (desc && desc.configurable) {
      delete g[key]
    }
  }
}

async function run(mode: Mode, iterations: number): Promise<void> {
  await gcAsync()
  const start = process.memoryUsage()
  for (let i = 0; i < iterations; i++) {
    const context = vm.createContext()
    const g = vm.runInContext('this', context) as Record<string, unknown>
    const { document, classes } = lazyDom()
    for (const [name, value] of Object.entries(classes)) g[name] = value
    g.document = document
    g.window = g
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      new vm.Script(makeTestModule(i * MODULES_PER_ITER + j), {
        filename: `test-${i}-mod-${j}.js`,
      }).runInContext(context)
    }
    switch (mode) {
      case 'lazy-default':
        reset()
        break
      case 'lazy-neuter-before-reset':
        neuterContext(g)
        reset()
        break
      case 'lazy-neuter-after-reset':
        reset()
        neuterContext(g)
        break
      case 'lazy-neuter-only':
        // Neuter but DON'T call reset() - to isolate neutering alone
        neuterContext(g)
        // Still need to clear nodeRegistry to avoid crash on next lazyDom()
        reset()
        break
    }
    if (i % 100 === 0) { await gcAsync() }
  }
  await gcAsync()
  const end = process.memoryUsage()
  console.log(`heapUsed ${Math.round(start.heapUsed/1024/1024)} -> ${Math.round(end.heapUsed/1024/1024)} MB (+${Math.round(end.heapUsed/1024/1024) - Math.round(start.heapUsed/1024/1024)})`)
}

function runChild(mode: string, iterations: number): string {
  const scriptPath = new URL(import.meta.url).pathname
  return execFileSync(
    process.execPath,
    ['--expose-gc', '--import', 'tsx', scriptPath, mode, String(iterations)],
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] }
  )
}

function main(): void {
  if (MODE === 'compare') {
    const modes = [
      { key: 'lazy-default', label: 'reset() only' },
      { key: 'lazy-neuter-before-reset', label: 'neuter + reset()' },
      { key: 'lazy-neuter-after-reset', label: 'reset() + neuter' },
    ]
    console.log('Neutering test (' + ITERATIONS + ' iterations)\n')
    for (const { key, label } of modes) {
      process.stderr.write('  Running ' + label + '...')
      const output = runChild(key, ITERATIONS)
      console.log(label.padEnd(30) + output.trim())
      process.stderr.write(' done\n')
    }
  } else {
    run(MODE, ITERATIONS).catch(console.error)
  }
}

main()
