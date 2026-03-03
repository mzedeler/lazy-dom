
import { expect } from 'chai'

describe('EventTarget', () => {
  it('addEventListener and dispatchEvent work', () => {
    const target = new EventTarget()
    let received = false
    target.addEventListener('test', () => { received = true })
    target.dispatchEvent(new Event('test'))
    expect(received).to.be.true
  })

  it('removeEventListener stops the listener from firing', () => {
    const target = new EventTarget()
    let count = 0
    const listener = () => { count++ }
    target.addEventListener('test', listener)
    target.dispatchEvent(new Event('test'))
    expect(count).to.equal(1)
    target.removeEventListener('test', listener)
    target.dispatchEvent(new Event('test'))
    expect(count).to.equal(1)
  })

  it('dispatchEvent returns true when no listener calls preventDefault', () => {
    const target = new EventTarget()
    target.addEventListener('test', () => {})
    const result = target.dispatchEvent(new Event('test'))
    expect(result).to.be.true
  })

  it('dispatchEvent returns false when a listener calls preventDefault on a cancelable event', () => {
    const target = new EventTarget()
    target.addEventListener('test', (e) => { e.preventDefault() })
    const result = target.dispatchEvent(new Event('test', { cancelable: true }))
    expect(result).to.be.false
  })

  it('supports once option', () => {
    const target = new EventTarget()
    let count = 0
    target.addEventListener('test', () => { count++ }, { once: true })
    target.dispatchEvent(new Event('test'))
    target.dispatchEvent(new Event('test'))
    expect(count).to.equal(1)
  })

  it('supports multiple listeners on the same event type', () => {
    const target = new EventTarget()
    const calls: number[] = []
    target.addEventListener('test', () => { calls.push(1) })
    target.addEventListener('test', () => { calls.push(2) })
    target.dispatchEvent(new Event('test'))
    expect(calls).to.deep.equal([1, 2])
  })
})
