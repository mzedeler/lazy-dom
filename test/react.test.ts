import { createRoot } from 'react-dom/client'
import * as React from 'react'
import * as chai from 'chai'
import { expect } from 'chai'
import { invariant } from '../src/utils/invariant'
import Sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

describe('react', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  it('supports createRoot()', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    createRoot(div)
  })

  it('supports root.render()', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)

    React.act(() => root.render([]))
  })

  it('supports React.createElement()', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)

    React.act(() => root.render(React.createElement('h1', {}, 'Hello' )))
  })

  it('supports onClick() with Reacts synthetic events', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)
    const onClick = Sinon.spy()
    const children: ReturnType<typeof React.createElement>[] = [React.createElement('span', {}, 'child')]
    React.act(() => root.render(React.createElement('span', { onClick, children }, 'Hello' )))
    const span = div.childNodes.item(0)

    invariant(span instanceof window.HTMLSpanElement , 'Must be span element')
    React.act(() => span.click())

    expect(onClick).to.have.been.called
  })

  it('supports disappearing elements', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)

    let resolve: (value?: unknown) => void
    const promise = new Promise(r => { resolve = r })

    const Container = () => {
      const [displayChildren, setDisplayChildren] = React.useState(true)
      React.useEffect(() => { setDisplayChildren(false) }, [])

      if (!displayChildren) {
        resolve()
      }

      return displayChildren ? React.createElement('span') : null
    }

    React.act(() => root.render(React.createElement(Container)))
    await promise

    expect(div).to.have.property('childNodes').with.length(0)
  })
})
