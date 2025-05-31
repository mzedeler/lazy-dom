import React from 'react'
import { screen, render, cleanup } from '@testing-library/react'
import { expect } from 'chai'
import sinon, { SinonSandbox, SinonStub } from 'sinon'
import sinonChai from 'sinon-chai'
import * as chai from 'chai'
import { HTMLSpanElement } from '../src/classes/elements/HTMLSpanElement'
import { createRoot } from 'react-dom/client'

chai.use(sinonChai)

describe('@testing-library/react', () => {
  afterEach(cleanup)

  let sandbox: SinonSandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  it('supports render()', async () => {
    render(React.createElement('div', { children: 'hello3'}))

    expect(screen.queryByText('hello3')).not.to.be.null
  })

  // TODO: Replace this with a test of `prettyDOM`:
  // https://testing-library.com/docs/dom-testing-library/api-debugging/#prettydom
  describe('screen.debug()', () => {
    let stub: SinonStub

    beforeEach(() => {
      stub = sandbox.stub(console, 'log')
      stub.callsFake(() => {})
    })
  
    it.skip('supports screen.debug()', () => {
      render(React.createElement('img', { alt: 'hello' }))
  
      screen.debug()
  
      expect(stub.firstCall.args[0]).to.match(/alt.*=.*"hello"/)
    })
   })

   it('supports screen.queryByText() where it finds a node', () => {
    const text = 'some text'
    const id = 'some-id'
    render(React.createElement('span', { id }, text))

    const spanElement = document.getElementById(id)
    expect(spanElement).not.to.be.undefined
    // expect(screen.queryByText(text)).to.eq.
  })

  it('interacting with rendered elements', () => {
    const text = 'some text'
    const id = 'some-id'
    render(React.createElement('span', { id }, text))

    const spanElement: HTMLElement = document.getElementById(id)!
    expect(spanElement).not.to.be.null
    expect(spanElement).to.be.instanceOf(HTMLSpanElement)
    React.act(() => spanElement.click())
  })

  // it('supports act', async () => {
  //   let callback:
  //   const subscribe = (cb) => { callback = cb }
  //   const Component = () => {
  //     const count = useSyncExternalStore(subscribe, getSnapshot)
  //     return React.createElement('input', { value, onChange: setValue })
  //   }

  //   const { container } = render(React.createElement(Component))
    
  //   console.log(screen.debug(container))
  // })
})
