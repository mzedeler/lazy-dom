import { createRoot } from 'react-dom/client'
import { act, createElement } from 'react'
import { expect } from 'chai'
import { JSDOM } from 'jsdom'

// @ts-expect-error
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('react with JSDOM', () => {
  beforeEach(() => {
    const dom = new JSDOM(``, {
      url: "https://example.org/",
      referrer: "https://example.com/",
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000
    })

    // @ts-expect-error
    global.window = dom.window
    global.document = dom.window.document
  })

  it('supports createRoot()', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const root = createRoot(div)
  })

  it('supports root.render()', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)

    act(() => root.render([]))
  })

  it('supports React.createElement()', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)

    act(() => root.render(createElement('h1', {}, 'Hello' )))
  })

  it('supports onClick() with Reacts synthetic events', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)
    let clicked = false
    const onClick = () => { clicked = true }
    const children: ReturnType<typeof createElement>[] = [createElement('span', {}, 'child')]
    act(() => root.render(createElement('span', { onClick, children }, 'Hello' )))
    const [span] = div.childNodes

    // @ts-expect-error click is on span
    act(() => span.click())

    expect(clicked).to.be.true
  })
})
