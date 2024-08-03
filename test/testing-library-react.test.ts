import React from 'react'
import { screen, render } from '@testing-library/react'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import sinonChai from 'sinon-chai'
import * as chai from 'chai'

chai.use(sinonChai)

describe('@testing-library/react', () => {
  it('supports render()', async () => {
    render(React.createElement('div', { children: 'hello2'}))
    
    expect(screen.queryByText('hello2')).not.to.be.null  
  })

  describe('screen.debug()', () => {
    let stub: SinonStub

    beforeEach(() => {
      stub = sinon.stub(console, 'log')
      stub.callsFake(() => {})
    })
  
    afterEach(() => {
      stub.restore()
    })

    it('supports screen.debug()', () => {
      render(React.createElement('img', { alt: 'hello' }))
  
      screen.debug()
  
      expect(stub.firstCall.args[0]).to.match(/alt.*=.*"hello"/)
    })
   })
 
  xit('supports act', async () => {
    // let callback:
    // const subscribe = (cb) => { callback = cb }
    // const Component = () => {
    //   const count = useSyncExternalStore(subscribe, getSnapshot)
    //   return React.createElement('input', { value, onChange: setValue })
    // }

    // const { container } = render(React.createElement(Component))
    
    // console.log(screen.debug(container))
  })

  // it('supports screen.queryByText() where it finds a node', async () => {
  //   const div = document.createElement('div')
  //   const textNode = document.createTextNode('hello')
  //   div.appendChild(textNode)
  //   document.body.appendChild(div)

  //   expect(screen.queryByText('hello')).to.eq(div)
  // })
})
