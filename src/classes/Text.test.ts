import { expect } from 'chai'

describe('Text', () => {
  describe('nodeValue', () => {
    it('getter returns the text data', () => {
      const text = document.createTextNode('hello')

      expect(text.nodeValue).to.eq('hello')
    })

    it('setter updates nodeValue', () => {
      const text = document.createTextNode('hello')
      text.nodeValue = 'world'

      expect(text.nodeValue).to.eq('world')
    })

    it('setter also updates data', () => {
      const text = document.createTextNode('hello')
      text.nodeValue = 'world'

      expect(text.data).to.eq('world')
    })
  })
})
