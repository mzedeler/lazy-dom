import { createRoot } from 'react-dom/client'
import { act, createElement } from 'react'
import { expect } from 'chai'
import lazyDom from './lazyDom'

// @ts-expect-error
globalThis.IS_REACT_ACT_ENVIRONMENT = true

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

    act(() => root.render([]))
  })

  it('supports React.createElement()', () => {
    const div = document.createElement('div')
    document.appendChild(div)
    const root = createRoot(div)

    act(() => root.render(createElement('h1', {}, 'Hello' )))
  })

  it('supports onClick() with Reacts synthetic events', async () => {
    const div = document.createElement('div')
    document.appendChild(div)
    const root = createRoot(div)
    let clicked = false
    const onClick = () => { clicked = true }
    act(() => root.render(createElement('span', { onClick }, 'Hello' )))
    const [span] = div.childNodes

    // @ts-expect-error click is on span
    act(() => span.click())

    expect(clicked).to.be.true
  })
})
