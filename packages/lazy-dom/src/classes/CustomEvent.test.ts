import { expect } from 'chai'

describe('CustomEvent', () => {
  it('creates a CustomEvent with default values', () => {
    const event = new CustomEvent('myevent')

    expect(event.type).to.eq('myevent')
    expect(event.detail).to.be.null
    expect(event.bubbles).to.be.false
  })

  it('accepts detail in init dict', () => {
    const event = new CustomEvent('myevent', { detail: { foo: 'bar' } })

    expect(event.detail).to.deep.eq({ foo: 'bar' })
  })

  it('supports initCustomEvent', () => {
    const event = new CustomEvent('_')
    event.initCustomEvent('test', true, true, 42)

    expect(event.type).to.eq('test')
    expect(event.bubbles).to.be.true
    expect(event.cancelable).to.be.true
    expect(event.detail).to.eq(42)
  })
})
