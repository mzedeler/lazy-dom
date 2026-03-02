
import { expect } from 'chai'

describe('Window', () => {
  describe('matchMedia()', () => {
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

  describe('EventTarget', () => {
    it('addEventListener registers a listener that receives dispatched events', () => {
      let received = false
      const listener = () => { received = true }
      window.addEventListener('scroll', listener)
      window.dispatchEvent(new window.Event('scroll'))
      expect(received).to.be.true
      window.removeEventListener('scroll', listener)
    })

    it('dispatches to multiple listeners for the same event type', () => {
      let count = 0
      const listenerA = () => { count++ }
      const listenerB = () => { count++ }
      window.addEventListener('resize', listenerA)
      window.addEventListener('resize', listenerB)
      window.dispatchEvent(new window.Event('resize'))
      expect(count).to.equal(2)
      window.removeEventListener('resize', listenerA)
      window.removeEventListener('resize', listenerB)
    })

    it('does not dispatch to listeners for a different event type', () => {
      let received = false
      const listener = () => { received = true }
      window.addEventListener('focus', listener)
      window.dispatchEvent(new window.Event('blur'))
      expect(received).to.be.false
      window.removeEventListener('focus', listener)
    })

    it('removeEventListener stops the listener from being called', () => {
      let count = 0
      const listener = () => { count++ }
      window.addEventListener('scroll', listener)
      window.dispatchEvent(new window.Event('scroll'))
      expect(count).to.equal(1)
      window.removeEventListener('scroll', listener)
      window.dispatchEvent(new window.Event('scroll'))
      expect(count).to.equal(1)
    })

    it('dispatchEvent returns true when event is not cancelled', () => {
      expect(window.dispatchEvent(new window.Event('scroll'))).to.be.true
    })

    it('dispatchEvent returns false when a listener calls preventDefault', () => {
      const listener = (e: Event) => { e.preventDefault() }
      window.addEventListener('scroll', listener)
      const result = window.dispatchEvent(new window.Event('scroll', { cancelable: true }))
      expect(result).to.be.false
      window.removeEventListener('scroll', listener)
    })
  })

  describe('dimensions', () => {
    it('has innerWidth', () => {
      expect(window).to.have.property('innerWidth')
      expect(window.innerWidth).to.be.a('number')
    })

    it('has innerHeight', () => {
      expect(window).to.have.property('innerHeight')
      expect(window.innerHeight).to.be.a('number')
    })

    it('innerWidth defaults to 1024', () => {
      expect(window.innerWidth).to.equal(1024)
    })

    it('innerHeight defaults to 768', () => {
      expect(window.innerHeight).to.equal(768)
    })
  })

  describe('open()', () => {
    it('is a function', () => {
      expect(window.open).to.be.a('function')
    })

    it('returns null', function () {
      // JSDOM returns undefined from window.open()
      if (!globalThis.__LAZY_DOM__) this.skip()
      expect(window.open()).to.equal(null)
    })
  })
})
