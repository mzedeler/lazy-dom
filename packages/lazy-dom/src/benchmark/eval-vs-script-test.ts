/**
 * Compare different ways of running code in vm contexts:
 * 1. vm.Script().runInContext() — what jest does
 * 2. eval via vm context — what JSDOM's dom.window.eval() does  
 * 3. JSDOM baseline for comparison
 */
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import lazyDom, { reset } from '../lazyDom'

type Mode = 'lazy-vmScript' | 'lazy-contextEval' | 'jsdom-eval' | 'compare'
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

async function runLazyVmScript(iterations: number): Promise<void> {
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
    reset()
    if (i % 100 === 0) { await gcAsync() }
  }
  await gcAsync()
  const end = process.memoryUsage()
  console.log(`heapUsed ${Math.round(start.heapUsed/1024/1024)} -> ${Math.round(end.heapUsed/1024/1024)} MB (+${Math.round(end.heapUsed/1024/1024) - Math.round(start.heapUsed/1024/1024)})`)
}

async function runLazyContextEval(iterations: number): Promise<void> {
  // Use eval() from inside the vm context, like JSDOM's dom.window.eval() does
  await gcAsync()
  const start = process.memoryUsage()
  for (let i = 0; i < iterations; i++) {
    const context = vm.createContext()
    const g = vm.runInContext('this', context) as Record<string, unknown>
    const { document, classes } = lazyDom()
    for (const [name, value] of Object.entries(classes)) g[name] = value
    g.document = document
    g.window = g
    // Get the eval function from inside the vm context
    const contextEval = vm.runInContext('eval', context) as (code: string) => unknown
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      contextEval(makeTestModule(i * MODULES_PER_ITER + j))
    }
    reset()
    if (i % 100 === 0) { await gcAsync() }
  }
  await gcAsync()
  const end = process.memoryUsage()
  console.log(`heapUsed ${Math.round(start.heapUsed/1024/1024)} -> ${Math.round(end.heapUsed/1024/1024)} MB (+${Math.round(end.heapUsed/1024/1024) - Math.round(start.heapUsed/1024/1024)})`)
}

async function runJsdomEval(iterations: number): Promise<void> {
  const { JSDOM } = await import('jsdom')
  await gcAsync()
  const start = process.memoryUsage()
  for (let i = 0; i < iterations; i++) {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      url: 'http://localhost',
    })
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      dom.window.eval(makeTestModule(i * MODULES_PER_ITER + j))
    }
    dom.window.close()
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
      { key: 'lazy-vmScript', label: 'lazy-dom via vm.Script()' },
      { key: 'lazy-contextEval', label: 'lazy-dom via context eval()' },
      { key: 'jsdom-eval', label: 'JSDOM via window.eval()' },
    ]
    console.log('eval vs vm.Script comparison (' + ITERATIONS + ' iterations)\n')
    for (const { key, label } of modes) {
      process.stderr.write('  Running ' + label + '...')
      const output = runChild(key, ITERATIONS)
      console.log(label.padEnd(36) + output.trim())
      process.stderr.write(' done\n')
    }
  } else if (MODE === 'lazy-vmScript') {
    runLazyVmScript(ITERATIONS).catch(console.error)
  } else if (MODE === 'lazy-contextEval') {
    runLazyContextEval(ITERATIONS).catch(console.error)
  } else if (MODE === 'jsdom-eval') {
    runJsdomEval(ITERATIONS).catch(console.error)
  }
}

main()
