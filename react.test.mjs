import { createRoot } from 'react-dom/client'
import { act, createElement } from 'react'
import { expect } from 'chai'
import lazyDom from './lazyDom.mjs'

describe('react', () => {
  it('supports createRoot()', () => {
    lazyDom()
    const div = document.createElement('div')
    document.appendChild(div)

    const root = createRoot(div)
  })

  it('supports root.render()', () => {
    lazyDom()
    const div = document.createElement('div')
    document.appendChild(div)

    const root = createRoot(div)
    root.render()
  })

  it('supports React.createElement()', () => {
    lazyDom()
    const div = document.createElement('div')
    document.appendChild(div)

    const root = createRoot(div)
    root.render(createElement('h1', {}, 'Hello' ))
  })

  it.only('supports onClick() with Reacts synthetic events', async () => {
    lazyDom()
    let clicked = false
    const onClick = () => { clicked = true }

    const div = document.createElement('div')
    document.appendChild(div)

    const root = createRoot(div)
    act(() => root.render(createElement('span', { onClick }, 'Hello' )))
    const [span] = div.childNodes

    act(() => span.click())

    expect(clicked).to.be.true
  })
})
