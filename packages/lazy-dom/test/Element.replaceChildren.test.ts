import { expect } from 'chai'

describe('Element', () => {
  afterEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('replaceChildren', () => {
    it('replaces all existing children', () => {
      const div = document.createElement('div')
      div.appendChild(document.createElement('span'))
      div.appendChild(document.createElement('p'))
      document.body.appendChild(div)

      const a = document.createElement('a')
      div.replaceChildren(a)
      expect(div.childNodes.length).to.equal(1)
      expect(div.childNodes[0]).to.equal(a)
    })

    it('removes all children when called with no arguments', () => {
      const div = document.createElement('div')
      div.appendChild(document.createElement('span'))
      div.appendChild(document.createElement('p'))
      document.body.appendChild(div)

      div.replaceChildren()
      expect(div.childNodes.length).to.equal(0)
    })

    it('accepts strings as text nodes', () => {
      const div = document.createElement('div')
      div.appendChild(document.createElement('span'))
      document.body.appendChild(div)

      div.replaceChildren('hello', 'world')
      expect(div.childNodes.length).to.equal(2)
      expect(div.childNodes[0]?.textContent).to.equal('hello')
      expect(div.childNodes[1]?.textContent).to.equal('world')
    })

    it('accepts a mix of nodes and strings', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const span = document.createElement('span')
      div.replaceChildren(span, 'text')
      expect(div.childNodes.length).to.equal(2)
      expect(div.childNodes[0]).to.equal(span)
      expect(div.childNodes[1]?.textContent).to.equal('text')
    })
  })
})
