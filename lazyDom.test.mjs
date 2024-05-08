
import { expect } from 'chai'
import lazyDom from './lazyDom.mjs'

describe('main', () => {
  it('initializes correctly', () => {
    lazyDom()

    expect(document).to.exist
  })

  it('supports screen.queryByText() with empty DOM', async () => {
    lazyDom()
    const { screen } = await import('@testing-library/dom')

    expect(screen.queryByText('hello')).to.be.null
  })

  it('has createElement()', () => {
    lazyDom()

    const div = document.createElement('div')
  })

  it('has createTextNode()', () => {
    lazyDom()

    const textNode = document.createTextNode('hello there')
  })

  it('has appendChild()', () => {
    lazyDom()

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
