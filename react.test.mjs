import { createRoot } from 'react-dom/client'
import { createElement } from 'react'

describe('react', () => {
  it('supports createRoot()', () => {
    const div = document.createElement('div')
    document.appendChild(div)

    const root = createRoot(div)
  })

  it('supports root.render()', () => {
    const div = document.createElement('div')
    document.appendChild(div)

    const root = createRoot(div)
    root.render()
  })

  it('supports React.createElement()', () => {
    const div = document.createElement('div')
    document.appendChild(div)

    const root = createRoot(div)
    root.render(createElement('h1', {}, 'Hello' ))
  })
})
