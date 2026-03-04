import { expect } from 'chai'

describe('DocumentFragment', () => {
  afterEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('append', () => {
    it('appends child nodes', () => {
      const frag = document.createDocumentFragment()
      const div = document.createElement('div')
      const span = document.createElement('span')
      frag.append(div, span)
      expect(frag.childNodes.length).to.equal(2)
      expect(frag.childNodes[0]).to.equal(div)
      expect(frag.childNodes[1]).to.equal(span)
    })

    it('appends strings as text nodes', () => {
      const frag = document.createDocumentFragment()
      frag.append('hello', 'world')
      expect(frag.childNodes.length).to.equal(2)
      expect(frag.childNodes[0]?.textContent).to.equal('hello')
      expect(frag.childNodes[1]?.textContent).to.equal('world')
    })

    it('appends a mix of nodes and strings', () => {
      const frag = document.createDocumentFragment()
      const div = document.createElement('div')
      frag.append(div, 'text')
      expect(frag.childNodes.length).to.equal(2)
      expect(frag.childNodes[0]).to.equal(div)
      expect(frag.childNodes[1]?.textContent).to.equal('text')
    })
  })

  describe('prepend', () => {
    it('prepends nodes before existing children', () => {
      const frag = document.createDocumentFragment()
      const existing = document.createElement('div')
      frag.appendChild(existing)

      const span = document.createElement('span')
      frag.prepend(span)
      expect(frag.childNodes[0]).to.equal(span)
      expect(frag.childNodes[1]).to.equal(existing)
    })

    it('prepends strings as text nodes', () => {
      const frag = document.createDocumentFragment()
      const existing = document.createElement('div')
      frag.appendChild(existing)

      frag.prepend('first')
      expect(frag.childNodes[0]?.textContent).to.equal('first')
      expect(frag.childNodes[1]).to.equal(existing)
    })
  })

  describe('replaceChildren', () => {
    it('replaces all existing children', () => {
      const frag = document.createDocumentFragment()
      frag.appendChild(document.createElement('div'))
      frag.appendChild(document.createElement('span'))

      const p = document.createElement('p')
      frag.replaceChildren(p)
      expect(frag.childNodes.length).to.equal(1)
      expect(frag.childNodes[0]).to.equal(p)
    })

    it('removes all children when called with no arguments', () => {
      const frag = document.createDocumentFragment()
      frag.appendChild(document.createElement('div'))
      frag.appendChild(document.createElement('span'))

      frag.replaceChildren()
      expect(frag.childNodes.length).to.equal(0)
    })

    it('accepts strings as text nodes', () => {
      const frag = document.createDocumentFragment()
      frag.appendChild(document.createElement('div'))

      frag.replaceChildren('hello', 'world')
      expect(frag.childNodes.length).to.equal(2)
      expect(frag.childNodes[0]?.textContent).to.equal('hello')
    })
  })
})
