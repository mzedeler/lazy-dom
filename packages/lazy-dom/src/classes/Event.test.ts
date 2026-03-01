
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
})
