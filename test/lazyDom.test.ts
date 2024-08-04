
import { expect } from 'chai'

describe('main', () => {
  it('has appendChild()', () => {
    const div = document.createElement('div')
    const textNode = document.createTextNode('hello there')

    div.appendChild(textNode)
  })

  describe('globals', () => {
    describe('window', () => {
      it('is defined', () => {
        expect(global).to.have.property('window')
      })
    })

    describe('window.HTMLIFrameElement', () => {
      it('is defined', () => {
        expect(window).to.have.property('HTMLIFrameElement')
      })
    })
  })

  describe('Body', () => {
    it('has tagName', () => {
      expect(document.body).to.have.property('tagName', 'BODY')
    })

    it('has nodeType', () => {
      expect(document.body).to.have.property('nodeType', document.ELEMENT_NODE)
    })
  })
})
