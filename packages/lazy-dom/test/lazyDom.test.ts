
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

  describe('Element.dispatchEvent', () => {
    before(function () {
      // Skip under JSDOM: JSDOM rejects non-JSDOM Event instances
      if (!globalThis.__LAZY_DOM__) this.skip()
    })

    it('sets target to the dispatched element', () => {
      const div = document.createElement('div')
      const event = new Event('click')
      let receivedTarget: unknown = null
      div.addEventListener('click', (e: Event) => {
        receivedTarget = e.target
      })
      div.dispatchEvent(event)
      expect(receivedTarget).to.equal(div)
    })

    it('sets target on externally constructed events', () => {
      const btn = document.createElement('button')
      const event = new Event('focus', { bubbles: true })
      let receivedTarget: unknown = null
      btn.addEventListener('focus', (e: Event) => {
        receivedTarget = e.target
      })
      btn.dispatchEvent(event)
      expect(receivedTarget).to.equal(btn)
    })

    it('returns true when event is not cancelled', () => {
      const div = document.createElement('div')
      const event = new Event('click', { cancelable: true })
      expect(div.dispatchEvent(event)).to.be.true
    })

    it('returns false when event is cancelled via preventDefault', () => {
      const div = document.createElement('div')
      const event = new Event('click', { cancelable: true })
      div.addEventListener('click', (e: Event) => {
        e.preventDefault()
      })
      expect(div.dispatchEvent(event)).to.be.false
    })
  })

  describe('Window EventTarget', () => {
    before(function () {
      // Skip under JSDOM: JSDOM rejects non-JSDOM Event instances
      if (!globalThis.__LAZY_DOM__) this.skip()
    })

    it('addEventListener registers a listener that receives dispatched events', () => {
      let received = false
      const listener = () => { received = true }
      window.addEventListener('scroll', listener)
      window.dispatchEvent(new Event('scroll'))
      expect(received).to.be.true
      window.removeEventListener('scroll', listener)
    })

    it('dispatches to multiple listeners for the same event type', () => {
      let count = 0
      const listenerA = () => { count++ }
      const listenerB = () => { count++ }
      window.addEventListener('resize', listenerA)
      window.addEventListener('resize', listenerB)
      window.dispatchEvent(new Event('resize'))
      expect(count).to.equal(2)
      window.removeEventListener('resize', listenerA)
      window.removeEventListener('resize', listenerB)
    })

    it('does not dispatch to listeners for a different event type', () => {
      let received = false
      const listener = () => { received = true }
      window.addEventListener('focus', listener)
      window.dispatchEvent(new Event('blur'))
      expect(received).to.be.false
      window.removeEventListener('focus', listener)
    })

    it('removeEventListener stops the listener from being called', () => {
      let count = 0
      const listener = () => { count++ }
      window.addEventListener('scroll', listener)
      window.dispatchEvent(new Event('scroll'))
      expect(count).to.equal(1)
      window.removeEventListener('scroll', listener)
      window.dispatchEvent(new Event('scroll'))
      expect(count).to.equal(1)
    })

    it('dispatchEvent returns true when event is not cancelled', () => {
      expect(window.dispatchEvent(new Event('scroll'))).to.be.true
    })

    it('dispatchEvent returns false when a listener calls preventDefault', () => {
      const listener = (e: Event) => { e.preventDefault() }
      window.addEventListener('scroll', listener)
      const result = window.dispatchEvent(new Event('scroll', { cancelable: true }))
      expect(result).to.be.false
      window.removeEventListener('scroll', listener)
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
