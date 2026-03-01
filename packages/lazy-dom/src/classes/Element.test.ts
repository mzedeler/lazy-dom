
import { expect } from 'chai'

describe('Element', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('dispatchEvent', () => {
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

  describe('dimension stubs', () => {
    it('clientWidth returns 0', () => {
      const div = document.createElement('div')
      expect(div.clientWidth).to.equal(0)
    })

    it('clientHeight returns 0', () => {
      const div = document.createElement('div')
      expect(div.clientHeight).to.equal(0)
    })

    it('scrollWidth returns 0', () => {
      const div = document.createElement('div')
      expect(div.scrollWidth).to.equal(0)
    })

    it('scrollHeight returns 0', () => {
      const div = document.createElement('div')
      expect(div.scrollHeight).to.equal(0)
    })

    it('scrollTop returns 0 and is settable', () => {
      const div = document.createElement('div')
      expect(div.scrollTop).to.equal(0)
      div.scrollTop = 100
      expect(div.scrollTop).to.equal(0)
    })

    it('scrollLeft returns 0 and is settable', () => {
      const div = document.createElement('div')
      expect(div.scrollLeft).to.equal(0)
      div.scrollLeft = 50
      expect(div.scrollLeft).to.equal(0)
    })
  })
})
