import { expect } from 'chai'

describe('FocusEvent', () => {
  it('creates a FocusEvent with type', () => {
    const event = new FocusEvent('focus')
    expect(event.type).to.eq('focus')
  })

  it('defaults relatedTarget to null', () => {
    const event = new FocusEvent('focus')
    expect(event.relatedTarget).to.be.null
  })

  it('accepts relatedTarget in init dict', () => {
    const el = document.createElement('div')
    const event = new FocusEvent('focus', { relatedTarget: el })
    expect(event.relatedTarget).to.eq(el)
  })

  it('accepts bubbles option', () => {
    const event = new FocusEvent('focusin', { bubbles: true })
    expect(event.bubbles).to.be.true
  })
})
