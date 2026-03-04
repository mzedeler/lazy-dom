
import { expect } from 'chai'
import sinon from 'sinon'

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

  describe('scroll properties', () => {
    it('scrollX defaults to 0', () => {
      expect(window.scrollX).to.equal(0)
    })

    it('scrollY defaults to 0', () => {
      expect(window.scrollY).to.equal(0)
    })

    it('pageXOffset defaults to 0', () => {
      expect(window.pageXOffset).to.equal(0)
    })

    it('pageYOffset defaults to 0', () => {
      expect(window.pageYOffset).to.equal(0)
    })

    it('scrollTo is a function', () => {
      expect(window.scrollTo).to.be.a('function')
    })

    it('scrollBy is a function', () => {
      expect(window.scrollBy).to.be.a('function')
    })

    it('scroll is a function', () => {
      expect(window.scroll).to.be.a('function')
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

  describe('requestAnimationFrame timing', () => {
    // The jest-environment-lazy-dom provides requestAnimationFrame using
    // setTimeout with a 16ms delay, matching JSDOM's pretendToBeVisual
    // behavior (~60fps). These tests verify that timing pattern ensures
    // callbacks don't fire prematurely during event processing.

    let clock: sinon.SinonFakeTimers

    beforeEach(() => {
      clock = sinon.useFakeTimers()
    })

    afterEach(() => {
      clock.restore()
    })

    // Replicate the rAF implementation from jest-environment-lazy-dom
    function createRaf() {
      let rafId = 0
      const pendingTimers = new Map<number, ReturnType<typeof globalThis.setTimeout>>()

      const raf = (cb: FrameRequestCallback) => {
        const id = ++rafId
        const timerId = setTimeout(() => {
          pendingTimers.delete(id)
          cb(Date.now())
        }, 16)
        pendingTimers.set(id, timerId)
        return id
      }

      const cancel = (id: number) => {
        const timerId = pendingTimers.get(id)
        if (timerId !== undefined) {
          clearTimeout(timerId)
          pendingTimers.delete(id)
        }
      }

      const cancelAll = () => {
        for (const [, timerId] of pendingTimers) {
          clearTimeout(timerId)
        }
        pendingTimers.clear()
      }

      return { raf, cancel, cancelAll, pendingTimers }
    }

    it('does not fire callback before 16ms', () => {
      const { raf } = createRaf()
      let called = false
      raf(() => { called = true })

      clock.tick(15)
      expect(called).to.be.false
    })

    it('fires callback after 16ms', () => {
      const { raf } = createRaf()
      let called = false
      raf(() => { called = true })

      clock.tick(16)
      expect(called).to.be.true
    })

    it('passes a timestamp argument to the callback', () => {
      const { raf } = createRaf()
      let receivedTimestamp: number | undefined
      raf((ts) => { receivedTimestamp = ts })

      clock.tick(16)
      expect(receivedTimestamp).to.be.a('number')
    })

    it('cancelAnimationFrame prevents the callback from firing', () => {
      const { raf, cancel } = createRaf()
      let called = false
      const id = raf(() => { called = true })

      cancel(id)
      clock.tick(100)
      expect(called).to.be.false
    })

    it('cancelling all pending rAFs prevents cross-test leaks', () => {
      const { raf, cancelAll } = createRaf()
      let call1 = false
      let call2 = false
      raf(() => { call1 = true })
      raf(() => { call2 = true })

      // Simulate test boundary cleanup
      cancelAll()

      clock.tick(100)
      expect(call1).to.be.false
      expect(call2).to.be.false
    })

    it('multiple rAF callbacks fire independently', () => {
      const { raf } = createRaf()
      const calls: number[] = []
      raf(() => { calls.push(1) })

      clock.tick(10)
      raf(() => { calls.push(2) })

      // First fires at 16ms, second at 26ms (10 + 16)
      clock.tick(6) // total: 16ms
      expect(calls).to.deep.equal([1])

      clock.tick(10) // total: 26ms
      expect(calls).to.deep.equal([1, 2])
    })

    it('callback from previous frame does not fire after cancelAll', () => {
      const { raf, cancelAll } = createRaf()
      const calls: string[] = []

      raf(() => { calls.push('previous-test-callback') })

      // Simulate test boundary: cancel all pending rAFs
      cancelAll()

      // New test schedules its own rAF
      raf(() => { calls.push('current-test-callback') })

      clock.tick(16)
      expect(calls).to.deep.equal(['current-test-callback'])
    })
  })
})
