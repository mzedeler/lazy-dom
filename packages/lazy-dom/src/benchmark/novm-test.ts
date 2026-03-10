import lazyDom, { reset } from '../lazyDom'

const ITERATIONS = 500
const MODULES_PER_ITER = 10

function makeTestCode(index: number): string {
  return `
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
  `
}

async function gcAsync(): Promise<void> {
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
}

async function main() {
  console.log('=== lazy-dom WITHOUT vm.createContext (using new Function) ===')
  await gcAsync()
  const start = process.memoryUsage()
  
  for (let i = 0; i < ITERATIONS; i++) {
    const { document } = lazyDom()
    ;(globalThis as Record<string, unknown>).document = document
    
    for (let j = 0; j < MODULES_PER_ITER; j++) {
      const fn = new Function(makeTestCode(i * MODULES_PER_ITER + j))
      fn()
    }
    
    delete (globalThis as Record<string, unknown>).document
    reset()
    
    if (i % 50 === 0 || i === ITERATIONS - 1) {
      await gcAsync()
      const mem = process.memoryUsage()
      const heapUsed = Math.round(mem.heapUsed / 1024 / 1024)
      console.log('iter ' + String(i).padStart(4) + ': heapUsed=' + heapUsed + ' MB')
    }
  }
  
  await gcAsync()
  const end = process.memoryUsage()
  const startHeap = Math.round(start.heapUsed / 1024 / 1024)
  const endHeap = Math.round(end.heapUsed / 1024 / 1024)
  console.log('\nGrowth: heapUsed ' + startHeap + ' -> ' + endHeap + ' MB (+' + (endHeap - startHeap) + ')')
}

main().catch(console.error)
