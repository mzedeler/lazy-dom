/**
 * Benchmarks for DOM serialization (outerHTML / innerHTML).
 * This is the dominant cost in failing test suites — toMatchSnapshot() calls
 * outerHTML which forces evaluation of ALL lazy thunk chains recursively.
 */

export const outerHTMLWideTree = () => {
  const root = document.createElement('div')
  root.setAttribute('id', 'root')
  root.setAttribute('class', 'container')
  document.body.appendChild(root)
  for (let i = 0; i < 100; i++) {
    const child = document.createElement('div')
    child.setAttribute('class', `item-${i}`)
    child.setAttribute('data-index', String(i))
    child.appendChild(document.createTextNode(`Item ${i}`))
    root.appendChild(child)
  }
  const html = root.outerHTML
  document.body.removeChild(root)
  return html
}

export const outerHTMLDeepTree = () => {
  const root = document.createElement('div')
  root.setAttribute('id', 'deep-root')
  document.body.appendChild(root)
  let current = root
  for (let i = 0; i < 20; i++) {
    const child = document.createElement('div')
    child.setAttribute('class', `level-${i}`)
    child.setAttribute('data-depth', String(i))
    child.appendChild(document.createTextNode(`Depth ${i}`))
    current.appendChild(child)
    current = child
  }
  const html = root.outerHTML
  document.body.removeChild(root)
  return html
}

export const outerHTMLRealisticTree = () => {
  const root = document.createElement('div')
  root.setAttribute('class', 'app')
  root.setAttribute('id', 'app-root')
  document.body.appendChild(root)

  // Header
  const header = document.createElement('header')
  header.setAttribute('class', 'header')
  header.setAttribute('role', 'banner')
  root.appendChild(header)

  const h1 = document.createElement('h1')
  h1.appendChild(document.createTextNode('My App'))
  header.appendChild(h1)

  const nav = document.createElement('nav')
  nav.setAttribute('class', 'nav')
  nav.setAttribute('role', 'navigation')
  header.appendChild(nav)

  for (let i = 0; i < 5; i++) {
    const a = document.createElement('a')
    a.setAttribute('href', `/page-${i}`)
    a.setAttribute('class', 'nav-link')
    a.appendChild(document.createTextNode(`Page ${i}`))
    nav.appendChild(a)
  }

  // Main content
  const main = document.createElement('main')
  main.setAttribute('class', 'main')
  main.setAttribute('role', 'main')
  root.appendChild(main)

  // Card list
  const ul = document.createElement('ul')
  ul.setAttribute('class', 'card-list')
  main.appendChild(ul)

  for (let i = 0; i < 15; i++) {
    const li = document.createElement('li')
    li.setAttribute('class', 'card')
    li.setAttribute('data-id', String(i))
    ul.appendChild(li)

    const h2 = document.createElement('h2')
    h2.setAttribute('class', 'card-title')
    h2.appendChild(document.createTextNode(`Card ${i}`))
    li.appendChild(h2)

    const p = document.createElement('p')
    p.setAttribute('class', 'card-body')
    p.appendChild(document.createTextNode(`Description for card ${i} with some content.`))
    li.appendChild(p)

    const span = document.createElement('span')
    span.setAttribute('class', 'card-tag')
    span.setAttribute('data-tag', `tag-${i % 3}`)
    span.appendChild(document.createTextNode(`Tag ${i % 3}`))
    li.appendChild(span)
  }

  // Footer
  const footer = document.createElement('footer')
  footer.setAttribute('class', 'footer')
  footer.setAttribute('role', 'contentinfo')
  root.appendChild(footer)

  const footerP = document.createElement('p')
  footerP.appendChild(document.createTextNode('Copyright 2024'))
  footer.appendChild(footerP)

  const html = root.outerHTML
  document.body.removeChild(root)
  return html
}

export const innerHTMLContainer = () => {
  const root = document.createElement('div')
  document.body.appendChild(root)
  for (let i = 0; i < 50; i++) {
    const span = document.createElement('span')
    span.setAttribute('class', `item-${i}`)
    span.setAttribute('data-value', String(i))
    span.appendChild(document.createTextNode(`Content ${i}`))
    root.appendChild(span)
  }
  const html = root.innerHTML
  document.body.removeChild(root)
  return html
}
