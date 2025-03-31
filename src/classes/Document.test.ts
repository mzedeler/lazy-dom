import { expect } from 'chai'
import { tag } from '../utils/tag'
import { div } from '../utils/div'

describe('Document', () => {
  beforeEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
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
    it('does not return elements that have not been attached', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)

      expect(document.getElementById(id)).to.be.null
    })

    it('has getElementById()', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)
      document.body.appendChild(element)
  
      const result = document.getElementById(id)
  
      expect(result).to.eq(element)
    })

    it('getElementById() can distinguish between two elements', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)
      document.body.appendChild(element)

      const id2 = '2'
      const element2 = document.createElement('span')
      element2.setAttribute('id', id2)
      document.body.appendChild(element2)

      const result = document.getElementById(id)
      expect(result).to.eq(element)

      const result2 = document.getElementById(id2)
      expect(result2).to.eq(element2)
    })
  })

  describe('getElementsByTagNameNS', () => {  
    it('has getElementsByTagNameNS()', () => {
      const namespace = 'http://www.w3.org/1999/xhtml'
      const tagName = 'span'
      const span = tag(namespace, tagName)
      const root = div('root', span)
      document.body.appendChild(root)

      const element = document.getElementsByTagNameNS(namespace, tagName).item(0)
  
      expect(element).to.eql(span)
    })

    it('includes tags added after the collection was returned', () => {
      const namespace = 'http://www.w3.org/1999/xhtml'
      const tagName = 'span'
      const collection = document.getElementsByTagNameNS(namespace, tagName)

      const span = tag(namespace, tagName)
      const root = div('root', span)
      document.body.appendChild(root)
  
      expect(collection.item(0)).to.eql(span)
    })

    it('returns a collection supporting namedItem using id', () => {
      const namespace = 'http://www.w3.org/1999/xhtml'
      const tagName = 'span'
      const key = 'some-id'
      const span = tag(namespace, tagName)
      const root = div('root', span)
      document.body.appendChild(root)
      span.setAttribute('id', key)

      const element = document.getElementsByTagNameNS(namespace, tagName).namedItem(key)
  
      expect(element).to.eql(span)

    })

    it('returns a collection supporting namedItem using name', () => {
      const namespace = 'http://www.w3.org/1999/xhtml'
      const tagName = 'span'
      const key = 'some-name'
      const span = tag(namespace, tagName)
      const root = div('root', span)
      document.body.appendChild(root)
      span.setAttribute('name', key)

      const element = document.getElementsByTagNameNS(namespace, tagName).namedItem(key)
  
      expect(element).to.eql(span)
    })
  })
})
