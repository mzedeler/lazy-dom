import { expect } from 'chai'
import { IntersectionObserver } from './IntersectionObserver'

describe('IntersectionObserver', () => {
  it('can be constructed with a callback', () => {
    const cb = () => {}
    const observer = new IntersectionObserver(cb)

    expect(observer).to.be.instanceOf(IntersectionObserver)
  })

  it('has default root, rootMargin, and thresholds', () => {
    const observer = new IntersectionObserver(() => {})

    expect(observer.root).to.be.null
    expect(observer.rootMargin).to.eq('0px 0px 0px 0px')
    expect(observer.thresholds).to.deep.eq([0])
  })

  it('accepts options', () => {
    const root = {}
    const observer = new IntersectionObserver(() => {}, {
      root,
      rootMargin: '10px 20px',
      threshold: [0, 0.5, 1],
    })

    expect(observer.root).to.eq(root)
    expect(observer.rootMargin).to.eq('10px 20px')
    expect(observer.thresholds).to.deep.eq([0, 0.5, 1])
  })

  it('accepts a single threshold number', () => {
    const observer = new IntersectionObserver(() => {}, { threshold: 0.5 })

    expect(observer.thresholds).to.deep.eq([0.5])
  })

  it('observe, unobserve, and disconnect do not throw', () => {
    const observer = new IntersectionObserver(() => {})
    const target = {}

    expect(() => observer.observe(target)).to.not.throw()
    expect(() => observer.unobserve(target)).to.not.throw()
    expect(() => observer.disconnect()).to.not.throw()
  })

  it('takeRecords returns an empty array', () => {
    const observer = new IntersectionObserver(() => {})

    expect(observer.takeRecords()).to.deep.eq([])
  })
})
