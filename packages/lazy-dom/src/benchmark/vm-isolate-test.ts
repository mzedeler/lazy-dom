/**
 * Test whether vm.Script filenames cause V8 compiled code retention.
 * Each mode runs in isolation (separate process via child_process).
 */
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import lazyDom, { reset } from '../lazyDom'

const ITERATIONS = 500
const MODULES_PER_ITER = 10

type Mode = 'lazy-unique-filename' | 'lazy-no-filename' | 'lazy-runInContext' | 'lazy-static-source' | 'lazy-no-scripts' | 'no-vm' | 'compare'

const MODE = process.argv[2] as Mode
const ITERS = parseInt(process.argv[3] || '500')

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

const STATIC_SOURCE = makeTestModule(0)

async function gcAsync(): Promise<void> {
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
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

async function run(mode: Mode, iterations: number): Promise<void> {
  await gcAsync()
  const start = process.memoryUsage()

  for (let i = 0; i < iterations; i++) {
    if (mode === 'no-vm') {
      // No vm context — use new Function on main context
      const { document } = lazyDom()
      ;(globalThis as Record<string, unknown>).document = document
      for (let j = 0; j < MODULES_PER_ITER; j++) {
        // Use eval to compile unique code each time
        eval(makeTestModule(i * MODULES_PER_ITER + j))
      }
      delete (globalThis as Record<string, unknown>).document
      reset()
    } else if (mode === 'lazy-no-scripts') {
      // Create context + setup DOM but don't compile any scripts
      setupContext()
      reset()
    } else {
      const { context } = setupContext()
      for (let j = 0; j < MODULES_PER_ITER; j++) {
        const idx = i * MODULES_PER_ITER + j
        switch (mode) {
          case 'lazy-unique-filename':
            new vm.Script(makeTestModule(idx), {
              filename: `test-${i}-mod-${j}.js`,
            }).runInContext(context)
            break
          case 'lazy-no-filename':
            new vm.Script(makeTestModule(idx)).runInContext(context)
            break
          case 'lazy-runInContext':
            vm.runInContext(makeTestModule(idx), context)
            break
          case 'lazy-static-source':
            new vm.Script(STATIC_SOURCE, {
              filename: 'static.js',
            }).runInContext(context)
            break
        }
      }
      reset()
    }
    if (i % 100 === 0 || i === iterations - 1) {
      await gcAsync()
    }
  }

  await gcAsync()
  const end = process.memoryUsage()
  const startH = Math.round(start.heapUsed / 1024 / 1024)
  const endH = Math.round(end.heapUsed / 1024 / 1024)
  console.log(`heapUsed ${startH} -> ${endH} MB (+${endH - startH})`)
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
      { key: 'lazy-unique-filename', label: 'vm + lazy-dom + unique filenames' },
      { key: 'lazy-no-filename', label: 'vm + lazy-dom + no filename' },
      { key: 'lazy-runInContext', label: 'vm + lazy-dom + vm.runInContext()' },
      { key: 'lazy-static-source', label: 'vm + lazy-dom + static source' },
      { key: 'lazy-no-scripts', label: 'vm + lazy-dom + NO scripts' },
      { key: 'no-vm', label: 'NO vm + lazy-dom (eval)' },
    ]
    console.log('VM variant comparison (' + ITERS + ' iterations, ' + MODULES_PER_ITER + ' modules/iter)\n')
    for (const { key, label } of modes) {
      process.stderr.write('  Running ' + label + '...')
      const output = runChild(key, ITERS)
      const match = output.match(/\+(-?\d+)\)/)
      const growth = match ? match[1] : '?'
      console.log(label.padEnd(46) + output.trim())
      process.stderr.write(' done\n')
    }
  } else {
    run(MODE, ITERS).catch(console.error)
  }
}

main()
