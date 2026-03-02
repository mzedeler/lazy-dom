import { expect } from 'chai'

describe('ErrorEvent', () => {
  it('creates an ErrorEvent with default values', () => {
    const event = new ErrorEvent('error')

    expect(event.type).to.eq('error')
    expect(event.message).to.eq('')
    expect(event.filename).to.eq('')
    expect(event.lineno).to.eq(0)
    expect(event.colno).to.eq(0)
    expect(event.error).to.be.null
  })

  it('accepts init dict', () => {
    const err = new TypeError('test error')
    const event = new ErrorEvent('error', {
      message: 'test error',
      filename: 'test.js',
      lineno: 42,
      colno: 7,
      error: err,
    })

    expect(event.message).to.eq('test error')
    expect(event.filename).to.eq('test.js')
    expect(event.lineno).to.eq(42)
    expect(event.colno).to.eq(7)
    expect(event.error).to.eq(err)
  })
})
