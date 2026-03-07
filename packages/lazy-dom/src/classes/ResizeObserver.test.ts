import { expect } from 'chai'
import { ResizeObserver } from './ResizeObserver'

describe('ResizeObserver', () => {
  it('can be constructed with a callback', () => {
    const cb = () => {}
    const observer = new ResizeObserver(cb)

    expect(observer).to.be.instanceOf(ResizeObserver)
  })

  it('observe and unobserve do not throw', () => {
    const observer = new ResizeObserver(() => {})
    const target = {}

    expect(() => observer.observe(target)).to.not.throw()
    expect(() => observer.unobserve(target)).to.not.throw()
  })

  it('disconnect does not throw', () => {
    const observer = new ResizeObserver(() => {})
    observer.observe({})

    expect(() => observer.disconnect()).to.not.throw()
  })

  it('observe accepts options', () => {
    const observer = new ResizeObserver(() => {})

    expect(() => observer.observe({}, { box: 'border-box' })).to.not.throw()
  })
})
