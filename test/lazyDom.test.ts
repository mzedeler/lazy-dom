
import { expect } from 'chai'

describe('main', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
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

  describe('window.matchMedia()', () => {
    before(function () {
      if (typeof window.matchMedia !== 'function') this.skip()
    })

    it('returns object with matches and media properties', () => {
      const result = window.matchMedia('(min-width: 768px)')

      expect(result).to.have.property('matches')
      expect(result.matches).to.be.a('boolean')
      expect(result).to.have.property('media')
      expect(result.media).to.be.a('string')
    })

    it('has addListener / removeListener methods', () => {
      const result = window.matchMedia('(min-width: 768px)')

      expect(result.addListener).to.be.instanceOf(Function)
      expect(result.removeListener).to.be.instanceOf(Function)
    })

    it('has addEventListener / removeEventListener methods', () => {
      const result = window.matchMedia('(min-width: 768px)')

      expect(result.addEventListener).to.be.instanceOf(Function)
      expect(result.removeEventListener).to.be.instanceOf(Function)
    })
  })

  describe('Event constructor', () => {
    it('creates an event with the correct type', () => {
      const event = new Event('click')

      expect(event.type).to.eq('click')
    })

    it('supports bubbles option', () => {
      const event = new Event('click', { bubbles: true })

      expect(event.bubbles).to.be.true
    })

    it('supports cancelable option', () => {
      const event = new Event('click', { cancelable: true })

      expect(event.cancelable).to.be.true
    })

    it('has preventDefault method', () => {
      const event = new Event('click')

      expect(event.preventDefault).to.be.instanceOf(Function)
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
