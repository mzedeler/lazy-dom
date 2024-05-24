
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

  describe('Body', () => {
    it('has tagName', () => {
      expect(document.body).to.have.property('tagName', 'BODY')
    })

    it('has nodeType', () => {
      expect(document.body).to.have.property('nodeType', document.ELEMENT_NODE)
    })
  })

  describe('Element', () => {
    it('has tagName', () => {
      const element = document.createElement('div')

      expect(element).to.have.property('tagName', 'DIV')
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

    it('has addEventListener', () => {
      const element = document.createElement('div')

      expect(element).to.have.property('addEventListener')
      expect(element).to.have.property('addEventListener').instanceOf(Function)
    })

    it('is possible to call addEventListener', () => {
      const element = document.createElement('div')

      expect(() => element.addEventListener('click', () => {})).not.to.throw
    })
  })
})
