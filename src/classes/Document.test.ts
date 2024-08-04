import { expect } from 'chai'
import lazyDom from '../lazyDom'
import type { Document } from './Document'

describe('Document', () => {
  let document: Document

  beforeEach(() => {
    const globals = lazyDom()
    document = globals.document
  })

  it('initializes correctly', () => {
    expect(document).to.exist
  })

  it('has createElement()', () => {
    document.createElement('div')
  })

  it('has createTextNode()', () => {
    document.createTextNode('hello there')
  })

  describe('getElementById()', () => {
    it('has getElementById()', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)
  
      const result = document.getElementById(id)
  
      expect(result).to.eq(element)
    })

    it('getElementById() can distinguish between two elements', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)

      const id2 = '2'
      const element2 = document.createElement('span')
      element2.setAttribute('id', id2)

      const result = document.getElementById(id)  
      expect(result).to.eq(element)

      const result2 = document.getElementById(id2)
      expect(result2).to.eq(element2)
    })
  })
})