import { createRoot } from 'react-dom/client'
import { act, createElement } from 'react'
import { expect } from 'chai'
import lazyDom from './lazyDom.mjs'

describe('react', () => {
  beforeEach(lazyDom)

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

  it('supports onClick() with Reacts synthetic events', async () => {
    const div = document.createElement('div')
    document.appendChild(div)
    const root = createRoot(div)
    let clicked = false
    const onClick = () => { clicked = true }
    act(() => root.render(createElement('span', { onClick }, 'Hello' )))
    const [span] = div.childNodes

    act(() => span.click())

    expect(clicked).to.be.true
  })
})
