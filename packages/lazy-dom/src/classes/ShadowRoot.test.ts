import { expect } from 'chai'
import type { Node } from './Node/Node'

// At runtime, attachShadow returns our ShadowRoot which extends Node.
// Cast so TypeScript sees _children and other internal properties.
type LazyDomShadowRoot = ShadowRoot & Node

describe('ShadowRoot', () => {
  describe('attachShadow', () => {
    it('returns a ShadowRoot with open mode', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      expect(shadow).to.not.be.undefined
      expect(shadow.mode).to.equal('open')
      expect(shadow.host).to.equal(el)
    })

    it('returns a ShadowRoot with closed mode', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'closed' })
      expect(shadow).to.not.be.undefined
      expect(shadow.mode).to.equal('closed')
      expect(shadow.host).to.equal(el)
    })

    it('throws when attaching a second shadow root', () => {
      const el = document.createElement('div')
      el.attachShadow({ mode: 'open' })
      expect(() => el.attachShadow({ mode: 'open' })).to.throw(
        /Shadow root cannot be created/
      )
    })

    it('throws DOMException with NotSupportedError name', () => {
      const el = document.createElement('div')
      el.attachShadow({ mode: 'open' })
      try {
        el.attachShadow({ mode: 'open' })
        expect.fail('should have thrown')
      } catch (e: unknown) {
        expect((e as { name: string }).name).to.equal('NotSupportedError')
      }
    })
  })

  describe('shadowRoot getter', () => {
    it('returns the shadow for open mode', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      expect(el.shadowRoot).to.equal(shadow)
    })

    it('returns null for closed mode', () => {
      const el = document.createElement('div')
      el.attachShadow({ mode: 'closed' })
      expect(el.shadowRoot).to.be.null
    })

    it('returns null when no shadow attached', () => {
      const el = document.createElement('div')
      expect(el.shadowRoot).to.be.null
    })
  })

  describe('child management', () => {
    it('supports appendChild and child access', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      const child = document.createElement('span')
      shadow.appendChild(child)
      expect(shadow.childNodes.length).to.equal(1)
      expect(shadow.firstChild).to.equal(child)
    })

    it('supports removeChild', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      const child = document.createElement('span')
      shadow.appendChild(child)
      shadow.removeChild(child)
      expect(shadow.childNodes.length).to.equal(0)
    })

    it('supports multiple children', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.appendChild(document.createElement('div'))
      shadow.appendChild(document.createElement('span'))
      shadow.appendChild(document.createTextNode('text'))
      expect(shadow.childNodes.length).to.equal(3)
    })
  })

  describe('innerHTML', () => {
    it('getter returns serialized HTML', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<p>Hello</p>'
      expect(shadow.innerHTML).to.equal('<p>Hello</p>')
    })

    it('setter parses HTML and creates child nodes', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<p>Hello</p>'
      expect(shadow.childNodes.length).to.equal(1)
      expect(shadow.firstChild!.nodeName).to.equal('P')
    })

    it('setter replaces existing children', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<span>old</span>'
      shadow.innerHTML = '<div>new</div>'
      expect(shadow.childNodes.length).to.equal(1)
      expect(shadow.firstChild!.nodeName).to.equal('DIV')
    })

    it('setter populates _children for parsed nodes', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' }) as LazyDomShadowRoot
      shadow.innerHTML = '<span>a</span><p>b</p>'

      expect(shadow._children).to.not.be.undefined
      expect(shadow._children!.size).to.equal(2)
    })

    it('setter clears _children from previous content', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' }) as LazyDomShadowRoot
      shadow.innerHTML = '<span>old</span>'
      const oldSpan = shadow.firstChild! as unknown as Node

      shadow.innerHTML = '<p>new</p>'
      const newP = shadow.firstChild! as unknown as Node

      expect(shadow._children!.has(oldSpan)).to.be.false
      expect(shadow._children!.has(newP)).to.be.true
    })

    it('setter with empty string clears all children', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' }) as LazyDomShadowRoot
      shadow.innerHTML = '<span>content</span>'
      shadow.innerHTML = ''
      expect(shadow.childNodes.length).to.equal(0)
      expect(shadow._children).to.be.undefined
    })

    it('getter returns empty string when no children', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      expect(shadow.innerHTML).to.equal('')
    })

    it('serializes nested elements correctly', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<div class="outer"><span>text</span></div>'
      expect(shadow.innerHTML).to.equal('<div class="outer"><span>text</span></div>')
    })
  })

  describe('querySelector / querySelectorAll', () => {
    it('querySelector finds elements within shadow root', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<div class="inner"><span>text</span></div>'
      const inner = shadow.querySelector('.inner')
      expect(inner).to.not.be.null
      expect(inner!.tagName).to.equal('DIV')
    })

    it('querySelector returns null when no match', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<p>text</p>'
      expect(shadow.querySelector('.nonexistent')).to.be.null
    })

    it('querySelectorAll returns all matching elements', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<p>a</p><p>b</p><span>c</span>'
      expect(shadow.querySelectorAll('p').length).to.equal(2)
    })

    it('querySelectorAll returns empty array when no match', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<p>text</p>'
      expect(shadow.querySelectorAll('.nonexistent').length).to.equal(0)
    })

    it('querySelector finds nested elements', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<div><ul><li class="item">text</li></ul></div>'
      const item = shadow.querySelector('.item')
      expect(item).to.not.be.null
      expect(item!.tagName).to.equal('LI')
    })
  })

  describe('adoptedStyleSheets', () => {
    it('defaults to empty array', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      expect(shadow.adoptedStyleSheets).to.deep.equal([])
    })

    it('is writable', () => {
      const el = document.createElement('div')
      const shadow = el.attachShadow({ mode: 'open' })
      const sheets: CSSStyleSheet[] = []
      shadow.adoptedStyleSheets = sheets
      expect(shadow.adoptedStyleSheets).to.equal(sheets)
    })
  })

  describe('ownerDocument', () => {
    it('inherits ownerDocument from the host element', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const shadow = el.attachShadow({ mode: 'open' })
      expect(shadow.ownerDocument).to.equal(document)
    })
  })
})
