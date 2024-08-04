import { expect } from 'chai'
import { Element } from './Element'
import lazyDom from '../lazyDom'
import type { Document } from './Document'
import type { Window } from './Window'

// import sinonChai from 'sinon-chai'
// import * as chai from 'chai'

// chai.use(sinonChai)

// globalThis.window = new Window()
// globalThis.document = globalThis.window.document

describe('Element', () => {
  let document: Document

  beforeEach(() => {
    const globals = lazyDom()
    document = globals.document
  })

  it('can be created', () => {
    const element = document.createElement('div')

    expect(element).to.be.instanceOf(Element)
  })

  it('has tagName', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('tagName', 'DIV')
  })

  it('has nodeType set to ELEMENT_NODE (1)', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('nodeType', 1)
  })

  it('has addEventListener()', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('addEventListener')
    expect(element.addEventListener).to.be.instanceof(Function)
  })

  it('has ownerDocument', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('ownerDocument', document)
  })

  it('has addEventListener', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('addEventListener')
    expect(element).to.have.property('addEventListener').instanceOf(Function)
  })

  it('is possible to call addEventListener', () => {
    const element = document.createElement('div')

    expect(() => element.addEventListener('click', () => {})).not.to.throw
  })
})
