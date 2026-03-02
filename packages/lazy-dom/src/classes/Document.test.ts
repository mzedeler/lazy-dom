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

  describe('document.location', () => {
    it('has protocol, hostname, pathname properties', () => {
      expect(document.location).to.have.property('protocol')
      expect(document.location).to.have.property('hostname')
      expect(document.location).to.have.property('pathname')
    })

    it('has href and origin properties', () => {
      expect(document.location).to.have.property('href')
      expect(document.location).to.have.property('origin')
    })

    it('has search and hash properties', () => {
      expect(document.location).to.have.property('search')
      expect(document.location).to.have.property('hash')
    })
  })

  describe('document.referrer', () => {
    it('is a string', () => {
      expect(document.referrer).to.be.a('string')
    })
  })

  describe('document.head', () => {
    it('exists', () => {
      expect(document.head).to.exist
    })

    it('has tagName HEAD', () => {
      expect(document.head).to.have.property('tagName', 'HEAD')
    })

    it('supports appendChild', () => {
      const el = document.createElement('meta')
      expect(() => document.head.appendChild(el)).not.to.throw
    })
  })

  describe('document.cookie', () => {
    it('returns empty string by default', () => {
      expect(document.cookie).to.eq('')
    })

    it('does not throw when setting a cookie', () => {
      expect(() => { document.cookie = 'foo=bar' }).not.to.throw
    })
  })

  describe('document.implementation.createHTMLDocument', () => {
    it('returns a Document', () => {
      const doc = document.implementation.createHTMLDocument('test')
      expect(doc).to.exist
      expect(doc.nodeType).to.eq(9)
    })

    it('has head and body elements', () => {
      const doc = document.implementation.createHTMLDocument('test')
      expect(doc.head).to.exist
      expect(doc.body).to.exist
    })

    it('sets the title when provided', () => {
      const doc = document.implementation.createHTMLDocument('My Title')
      const titleEl = doc.head.querySelector('title')
      expect(titleEl).to.exist
      expect(titleEl!.textContent).to.eq('My Title')
    })
  })

  describe('createEvent', () => {
    it('creates an Event for "Event" interface', () => {
      const event = document.createEvent('Event')
      expect(event).to.be.instanceOf(window.Event)
    })

    it('creates an Event for "HTMLEvents" interface', () => {
      const event = document.createEvent('HTMLEvents')
      expect(event).to.be.instanceOf(window.Event)
    })

    it('creates a MouseEvent for "MouseEvent" interface', () => {
      const event = document.createEvent('MouseEvent')
      expect(event).to.be.instanceOf(MouseEvent)
    })

    it('creates a KeyboardEvent for "KeyboardEvent" interface', () => {
      const event = document.createEvent('KeyboardEvent')
      expect(event).to.be.instanceOf(KeyboardEvent)
    })

    it('throws for unknown event interface', () => {
      expect(() => document.createEvent('UnknownEvent')).to.throw
    })

    it('returns an event that supports initEvent', () => {
      const event = document.createEvent('Event')
      event.initEvent('click', true, true)
      expect(event.type).to.eq('click')
      expect(event.bubbles).to.be.true
      expect(event.cancelable).to.be.true
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
