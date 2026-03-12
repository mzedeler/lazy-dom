/**
 * Standalone leak test: measures memory growth when repeatedly creating
 * and resetting lazy-dom environments WITHOUT Jest.
 *
 * This isolates whether memory retention is in lazy-dom itself or in the
 * Jest vm context / runtime integration.
 *
 * Usage: node --expose-gc packages/bench-pro/standalone-leak-test.mjs
 */

import lazyDomModule from "../lazy-dom/dist/lazyDom.js"
const lazyDom = lazyDomModule.default
const reset = lazyDomModule.reset

const ITERATIONS = 500
const GC_INTERVAL = 50  // gc every N iterations

function mb(bytes) {
  return Math.round(bytes / 1024 / 1024)
}

// Warm up
{
  const { document } = lazyDom()
  const div = document.createElement("div")
  div.textContent = "warm up"
  document.body.appendChild(div)
  reset()
}

if (global.gc) global.gc()
const before = process.memoryUsage()

for (let i = 0; i < ITERATIONS; i++) {
  const { window, document } = lazyDom()

  // Simulate a React-like workload: create a moderately complex DOM tree
  const root = document.createElement("div")
  root.id = "root"
  document.body.appendChild(root)

  for (let j = 0; j < 20; j++) {
    const section = document.createElement("section")
    section.className = `section-${j}`
    for (let k = 0; k < 5; k++) {
      const p = document.createElement("p")
      p.textContent = `Paragraph ${j}-${k}`
      const span = document.createElement("span")
      span.setAttribute("data-testid", `span-${j}-${k}`)
      span.textContent = "inner"
      p.appendChild(span)
      section.appendChild(p)
    }
    root.appendChild(section)
  }

  // Query the DOM (triggers lazy evaluation)
  const spans = document.querySelectorAll("span")
  const html = root.innerHTML

  // Add/remove event listeners
  const handler = () => {}
  root.addEventListener("click", handler)
  root.removeEventListener("click", handler)

  // Reset everything
  reset()

  if (global.gc && (i + 1) % GC_INTERVAL === 0) {
    global.gc()
    const mem = process.memoryUsage()
    console.log(`  After ${i + 1} iterations: heapUsed=${mb(mem.heapUsed)} MB`)
  }
}

if (global.gc) {
  global.gc()
  await new Promise(resolve => setTimeout(resolve, 100))
  global.gc()
}

const after = process.memoryUsage()

console.log("\n=== Standalone Leak Test ===")
console.log(`  Iterations: ${ITERATIONS}`)
console.log(`  heapUsed before: ${mb(before.heapUsed)} MB`)
console.log(`  heapUsed after:  ${mb(after.heapUsed)} MB`)
console.log(`  heapUsed growth: +${mb(after.heapUsed - before.heapUsed)} MB`)
console.log(`  Per iteration:   ${((after.heapUsed - before.heapUsed) / ITERATIONS / 1024 / 1024).toFixed(3)} MB`)
