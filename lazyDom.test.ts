
import { expect } from 'chai'

describe('main', () => {
  it('initializes correctly', () => {
    expect(document).to.exist
  })

  it('has createElement()', () => {
    const div = document.createElement('div')
  })

  it('has createTextNode()', () => {
    const textNode = document.createTextNode('hello there')
  })

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

  describe('Element', () => {
    it('has tagName', () => {
      const element = document.createElement('div')

      expect(element).to.have.property('tagName', 'div')
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
  })
})
