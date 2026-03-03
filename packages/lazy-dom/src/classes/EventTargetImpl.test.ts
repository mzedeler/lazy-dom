import { expect } from 'chai'
import {
  EventTargetStore,
  addEventListenerImpl,
  removeEventListenerImpl,
  fireListenersImpl,
  fireListenersAtTarget,
} from './EventTargetImpl'
import type { Event as LazyEvent } from './Event'

// Minimal mock satisfying the fields EventTargetImpl reads/writes,
// without importing the full lazy-dom Event class (which would trigger
// a circular dependency chain in JSDOM mode).
function makeEvent(): LazyEvent {
  const event = {
    _stopImmediatePropagation: false,
    cancelBubble: false,
    defaultPrevented: false,
    stopImmediatePropagation() {
      event._stopImmediatePropagation = true
      event.cancelBubble = true
    },
  }
  return event as unknown as LazyEvent
}

describe('EventTargetImpl', () => {
  describe('once option', () => {
    it('removes the listener after the first invocation', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      addEventListenerImpl(store, 'click', () => log.push('fired'), { once: true })

      fireListenersAtTarget(store, 'click', makeEvent())
      fireListenersAtTarget(store, 'click', makeEvent())

      expect(log).to.eql(['fired'])
    })
  })

  describe('listener deduplication', () => {
    it('does not add the same listener+capture combination twice', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      const fn = () => log.push('fired')
      addEventListenerImpl(store, 'click', fn)
      addEventListenerImpl(store, 'click', fn)

      fireListenersAtTarget(store, 'click', makeEvent())

      expect(log).to.eql(['fired'])
    })

    it('allows the same listener with different capture flags', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      const fn = () => log.push('fired')
      addEventListenerImpl(store, 'click', fn, false)
      addEventListenerImpl(store, 'click', fn, true)

      fireListenersAtTarget(store, 'click', makeEvent())

      expect(log).to.eql(['fired', 'fired'])
    })
  })

  describe('at-target ordering', () => {
    it('fires all listeners in registration order regardless of capture flag', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      addEventListenerImpl(store, 'click', () => log.push('bubble1'), false)
      addEventListenerImpl(store, 'click', () => log.push('capture1'), true)
      addEventListenerImpl(store, 'click', () => log.push('bubble2'), false)

      fireListenersAtTarget(store, 'click', makeEvent())

      expect(log).to.eql(['bubble1', 'capture1', 'bubble2'])
    })
  })

  describe('stopImmediatePropagation', () => {
    it('stops subsequent listeners from firing', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      addEventListenerImpl(store, 'click', (e) => {
        log.push('first')
        e.stopImmediatePropagation()
      })
      addEventListenerImpl(store, 'click', () => log.push('second'))

      fireListenersAtTarget(store, 'click', makeEvent())

      expect(log).to.eql(['first'])
    })
  })

  describe('error handling', () => {
    it('dispatches errors to the error handler and continues', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      const errors: unknown[] = []
      addEventListenerImpl(store, 'click', () => { throw new Error('boom') })
      addEventListenerImpl(store, 'click', () => log.push('second'))

      fireListenersAtTarget(store, 'click', makeEvent(), (err) => errors.push(err))

      expect(log).to.eql(['second'])
      expect(errors).to.have.length(1)
      expect((errors[0] as Error).message).to.equal('boom')
    })
  })

  describe('fireListenersImpl (capture-filtered)', () => {
    it('only fires listeners matching the capture flag', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      addEventListenerImpl(store, 'click', () => log.push('bubble'), false)
      addEventListenerImpl(store, 'click', () => log.push('capture'), true)

      fireListenersImpl(store, 'click', makeEvent(), true)

      expect(log).to.eql(['capture'])
    })
  })

  describe('removeEventListenerImpl', () => {
    it('removes a previously added listener', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      const fn = () => log.push('fired')
      addEventListenerImpl(store, 'click', fn)
      removeEventListenerImpl(store, 'click', fn)

      fireListenersAtTarget(store, 'click', makeEvent())

      expect(log).to.eql([])
    })

    it('only removes the matching capture variant', () => {
      const store = new EventTargetStore()
      const log: string[] = []
      const fn = () => log.push('fired')
      addEventListenerImpl(store, 'click', fn, false)
      addEventListenerImpl(store, 'click', fn, true)
      removeEventListenerImpl(store, 'click', fn, false)

      fireListenersImpl(store, 'click', makeEvent(), true)

      expect(log).to.eql(['fired'])
    })
  })
})
