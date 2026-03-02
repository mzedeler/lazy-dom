
import { expect } from 'chai'

describe('Event', () => {
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

  describe('stopPropagation', () => {
    it('sets cancelBubble to true', () => {
      const event = new Event('click')
      event.stopPropagation()

      expect(event.cancelBubble).to.be.true
    })
  })

  describe('stopImmediatePropagation', () => {
    it('sets cancelBubble to true', () => {
      const event = new Event('click')
      event.stopImmediatePropagation()

      expect(event.cancelBubble).to.be.true
    })

    it('prevents subsequent listeners on the same element from firing', () => {
      const el = document.createElement('div')
      const log: string[] = []
      el.addEventListener('click', (e: Event) => {
        log.push('first')
        e.stopImmediatePropagation()
      })
      el.addEventListener('click', () => {
        log.push('second')
      })
      el.dispatchEvent(new Event('click', { bubbles: true }))

      expect(log).to.eql(['first'])
    })
  })

  describe('initEvent', () => {
    it('sets type, bubbles, and cancelable', () => {
      const event = new Event('_')
      event.initEvent('click', true, true)

      expect(event.type).to.eq('click')
      expect(event.bubbles).to.be.true
      expect(event.cancelable).to.be.true
    })

    it('defaults bubbles and cancelable to false', () => {
      const event = new Event('_')
      event.initEvent('focus')

      expect(event.type).to.eq('focus')
      expect(event.bubbles).to.be.false
      expect(event.cancelable).to.be.false
    })
  })
})
