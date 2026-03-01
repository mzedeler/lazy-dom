/**
 * Benchmarks for tree building without reading (the "happy path" for lazy-dom).
 * Builds trees of increasing size without materializing any thunks via serialization.
 * Structure: header (h1, nav with links) + N cards (h2 + p + button) + footer.
 */

function buildTree(cardCount: number) {
  const root = document.createElement('div')
  root.setAttribute('class', 'app')
  root.setAttribute('id', 'root')
  document.body.appendChild(root)

  // Header
  const header = document.createElement('header')
  header.setAttribute('class', 'header')
  header.setAttribute('role', 'banner')
  root.appendChild(header)

  const h1 = document.createElement('h1')
  h1.setAttribute('class', 'title')
  h1.appendChild(document.createTextNode('App Title'))
  header.appendChild(h1)

  const nav = document.createElement('nav')
  nav.setAttribute('role', 'navigation')
  nav.setAttribute('aria-label', 'Main')
  header.appendChild(nav)

  for (let i = 0; i < 4; i++) {
    const a = document.createElement('a')
    a.setAttribute('href', `/page-${i}`)
    a.setAttribute('class', 'nav-link')
    a.appendChild(document.createTextNode(`Link ${i}`))
    nav.appendChild(a)
  }

  // Cards
  const container = document.createElement('main')
  container.setAttribute('class', 'cards')
  container.setAttribute('role', 'main')
  root.appendChild(container)

  for (let i = 0; i < cardCount; i++) {
    const card = document.createElement('div')
    card.setAttribute('class', 'card')
    card.setAttribute('data-id', String(i))
    card.setAttribute('data-category', `cat-${i % 5}`)
    container.appendChild(card)

    const h2 = document.createElement('h2')
    h2.setAttribute('class', 'card-title')
    h2.appendChild(document.createTextNode(`Card ${i}`))
    card.appendChild(h2)

    const p = document.createElement('p')
    p.setAttribute('class', 'card-desc')
    p.appendChild(document.createTextNode(`Description for card number ${i}.`))
    card.appendChild(p)

    const btn = document.createElement('button')
    btn.setAttribute('type', 'button')
    btn.setAttribute('class', 'card-btn')
    btn.setAttribute('data-action', 'select')
    btn.appendChild(document.createTextNode('Select'))
    card.appendChild(btn)
  }

  // Footer
  const footer = document.createElement('footer')
  footer.setAttribute('class', 'footer')
  footer.setAttribute('role', 'contentinfo')
  root.appendChild(footer)

  const footerText = document.createElement('p')
  footerText.appendChild(document.createTextNode('Footer content'))
  footer.appendChild(footerText)

  document.body.removeChild(root)
}

// ~50 elements (header + nav + 4 links + main + 10 cards * 4 elements + footer + p)
export const bulkTreeSmall = () => buildTree(10)

// ~100 elements
export const bulkTreeMedium = () => buildTree(25)

// ~200 elements
export const bulkTreeLarge = () => buildTree(50)
