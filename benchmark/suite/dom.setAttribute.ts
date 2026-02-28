/**
 * Benchmarks for setAttribute thunk chain depth.
 * Tests the O(N^2) closure chain hypothesis: each setAttribute wraps a new thunk,
 * and reading attributes evaluates the full chain.
 */

function setAttributesAndRead(count: number) {
  const el = document.createElement('div')
  document.body.appendChild(el)
  for (let i = 0; i < count; i++) {
    el.setAttribute(`data-attr-${i}`, `value-${i}`)
  }
  // Force evaluation of the full thunk chain
  const len = el.attributes.length
  document.body.removeChild(el)
  return len
}

export const setAttribute10 = () => setAttributesAndRead(10)

export const setAttribute50 = () => setAttributesAndRead(50)

export const setAttribute100 = () => setAttributesAndRead(100)

export const setAttributeOverwrite50 = () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  for (let i = 0; i < 50; i++) {
    el.setAttribute('data-x', `value-${i}`)
  }
  // Force evaluation
  const val = el.getAttribute('data-x')
  document.body.removeChild(el)
  return val
}
