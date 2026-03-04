
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

  describe('getSelection()', () => {
    before(function () {
      if (typeof window.getSelection !== 'function') this.skip()
    })

    it('returns a Selection object', () => {
      const sel = window.getSelection()
      expect(sel).to.not.be.null
      expect(sel).to.have.property('rangeCount')
      expect(sel).to.have.property('anchorNode')
    })

    it('returns the same instance on repeated calls', () => {
      expect(window.getSelection()).to.equal(window.getSelection())
    })

    it('supports addRange and removeAllRanges', () => {
      const sel = window.getSelection()!
      sel.removeAllRanges()
      expect(sel.rangeCount).to.equal(0)

      const range = document.createRange()
      const textNode = document.createTextNode('hello')
      document.body.appendChild(textNode)
      range.setStart(textNode, 0)
      range.setEnd(textNode, 5)
      sel.addRange(range)
      expect(sel.rangeCount).to.equal(1)

      sel.removeAllRanges()
      expect(sel.rangeCount).to.equal(0)
      document.body.removeChild(textNode)
    })
  })

  describe('location', () => {
    it('has a default href', () => {
      expect(window.location.href).to.be.a('string')
      expect(window.location.href).to.match(/^https?:\/\//)
    })

    it('has readable location properties', () => {
      expect(window.location.protocol).to.be.a('string')
      expect(window.location.hostname).to.be.a('string')
      expect(window.location.pathname).to.be.a('string')
      expect(window.location.origin).to.be.a('string')
      expect(window.location.host).to.be.a('string')
      expect(window.location.port).to.be.a('string')
      expect(window.location.search).to.be.a('string')
      expect(window.location.hash).to.be.a('string')
    })

    it('setting hash updates hash and href', () => {
      const originalHash = window.location.hash
      try {
        window.location.hash = '#test'
        expect(window.location.hash).to.equal('#test')
        expect(window.location.href).to.include('#test')
      } finally {
        window.location.hash = originalHash || ''
      }
    })

    it('setting href to a different URL is a no-op', () => {
      const originalHref = window.location.href
      window.location.href = 'https://example.com/other'
      expect(window.location.href).to.equal(originalHref)
    })

    it('has assign, replace, and reload methods', () => {
      expect(window.location.assign).to.be.a('function')
      expect(window.location.replace).to.be.a('function')
      expect(window.location.reload).to.be.a('function')
    })

    it('toString() returns href', () => {
      expect(window.location.toString()).to.equal(window.location.href)
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
