import { expect } from 'chai'
import { tag } from '../utils/tag'
import { div } from '../utils/div'

describe('Document', () => {
  beforeEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  afterEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
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

  describe('document.write with full HTML', () => {
    it('replaces document content when writing a full HTML document', () => {
      const doc = document.implementation.createHTMLDocument('')
      doc.open()
      doc.write('<html><head><title>hello</title></head><body>world</body></html>')
      doc.close()
      const titleEl = doc.head.querySelector('title')
      expect(titleEl).to.exist
      expect(titleEl!.textContent).to.eq('hello')
      expect(doc.body.textContent).to.eq('world')
    })

    it('handles frameset documents replacing body', () => {
      const doc = document.implementation.createHTMLDocument('')
      doc.open()
      doc.write('<html><head></head><frameset><frame src="javascript:notfine"></frameset></html>')
      doc.close()
      const html = doc.documentElement
      expect(html.childNodes).to.have.length(2)
      const frameset = html.lastChild as Element
      expect(frameset.tagName).to.eq('FRAMESET')
      const frame = frameset.firstChild as Element
      expect(frame.tagName).to.eq('FRAME')
      expect(frame.getAttribute('src')).to.eq('javascript:notfine')
    })

    it('clears previous content on open()', function () {
      // JSDOM's open() destroys the document structure, making head/body null
      if (!globalThis.__LAZY_DOM__) this.skip()
      const doc = document.implementation.createHTMLDocument('old')
      expect(doc.head.querySelector('title')!.textContent).to.eq('old')
      doc.open()
      expect(doc.head.childNodes).to.have.length(0)
    })
  })

  describe('removeChild with null argument', () => {
    it('throws TypeError when node argument is null', () => {
      const el = document.createElement('div')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => el.removeChild(null as any)).to.throw(TypeError)
    })

    it('throws TypeError when node argument is undefined', () => {
      const el = document.createElement('div')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => el.removeChild(undefined as any)).to.throw(TypeError)
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

  describe('on* event handler properties', () => {
    it('oninput property exists on document', () => {
      expect('oninput' in document).to.be.true
    })

    it('onclick property exists on document', () => {
      expect('onclick' in document).to.be.true
    })

    it('onchange property exists on document', () => {
      expect('onchange' in document).to.be.true
    })

    it('on* properties default to null', () => {
      expect(document.onclick).to.be.null
      expect(document.oninput).to.be.null
    })
  })

  describe('Node-like methods', () => {
    it('appendChild appends a child to the document', () => {
      const docEl = document.documentElement
      document.removeChild(docEl)
      const newHtml = document.createElement('html')
      document.appendChild(newHtml)

      expect(document.childNodes).to.include(newHtml)
      // Restore original state
      document.removeChild(newHtml)
      document.appendChild(docEl)
    })

    it('removeChild removes documentElement from the document', () => {
      const docEl = document.documentElement
      document.removeChild(docEl)

      expect(document.childNodes).to.not.include(docEl)
      // Restore original state
      document.appendChild(docEl)
    })

    it('insertBefore inserts before a reference child', () => {
      const comment = document.createComment('test')
      document.appendChild(comment)

      const newComment = document.createComment('inserted')
      document.insertBefore(newComment, comment)

      const children = Array.from(document.childNodes)
      const commentIdx = children.indexOf(comment)
      const newIdx = children.indexOf(newComment)
      expect(newIdx).to.be.lessThan(commentIdx)
      expect(newIdx).to.be.at.least(0)

      // Restore original state
      document.removeChild(newComment)
      document.removeChild(comment)
    })

    it('replaceChild replaces an existing child', () => {
      const comment = document.createComment('old')
      document.appendChild(comment)

      const replacement = document.createComment('new')
      document.replaceChild(replacement, comment)

      expect(document.childNodes).to.include(replacement)
      expect(document.childNodes).to.not.include(comment)

      // Restore original state
      document.removeChild(replacement)
    })

    it('removeChild throws NotFoundError for non-child node', () => {
      const detached = document.createElement('div')

      expect(() => document.removeChild(detached)).to.throw(/not a child/)
    })

    it('insertBefore throws NotFoundError for invalid reference node', () => {
      const newNode = document.createComment('new')
      const fakeRef = document.createComment('fake')

      expect(() => document.insertBefore(newNode, fakeRef)).to.throw(/not a child|can not be found/)
    })

    it('contains returns true for contained elements', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)

      expect(document.contains(el)).to.be.true
    })

    it('contains returns false for detached elements', () => {
      const el = document.createElement('div')

      expect(document.contains(el)).to.be.false
    })
  })

  describe('activeElement', () => {
    it('defaults to body', () => {
      expect(document.activeElement).to.eq(document.body)
    })

    it('tracks focused element', () => {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      expect(document.activeElement).to.eq(input)

      input.blur()
    })

    it('returns to body after blur', () => {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()
      input.blur()

      expect(document.activeElement).to.eq(document.body)
    })
  })

  describe('open/close/write', () => {
    it('has open as a function', () => {
      expect(document.open).to.be.instanceOf(Function)
    })

    it('has close as a function', () => {
      expect(document.close).to.be.instanceOf(Function)
    })

    it('has write as a function', () => {
      expect(document.write).to.be.instanceOf(Function)
    })

    it('has writeln as a function', () => {
      expect(document.writeln).to.be.instanceOf(Function)
    })

    it('open returns the document', () => {
      const doc = document.implementation.createHTMLDocument('')
      expect(doc.open()).to.eq(doc)
    })
  })

  describe('namespaceURI', () => {
    it('createElement sets XHTML namespace', () => {
      const el = document.createElement('div')

      expect(el.namespaceURI).to.eq('http://www.w3.org/1999/xhtml')
    })
  })

  describe('getSelection()', () => {
    before(function () {
      if (typeof document.getSelection !== 'function') this.skip()
    })

    it('returns a Selection object', () => {
      const sel = document.getSelection()
      expect(sel).to.not.be.null
      expect(sel).to.have.property('rangeCount')
    })

    it('returns the same instance as window.getSelection()', () => {
      expect(document.getSelection()).to.equal(window.getSelection())
    })
  })

  describe('scrollingElement', () => {
    it('returns the documentElement', function () {
      if (!globalThis.__LAZY_DOM__) this.skip()
      expect(document.scrollingElement).to.equal(document.documentElement)
    })

    it('is defined', function () {
      if (!globalThis.__LAZY_DOM__) this.skip()
      expect(document).to.have.property('scrollingElement')
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
