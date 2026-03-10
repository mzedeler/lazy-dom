import { expect } from 'chai'
import lazyDom from './lazyDom'

describe('lazyDom', () => {
  before(function () {
    if (!globalThis.__LAZY_DOM__) this.skip()
  })

  describe('lazyDom() assigns class constructors to process global', () => {
    it('puts class constructors (but not instances) on the process global', () => {
      const { classes } = lazyDom()

      // Class constructors must be on process global for instanceof
      // checks in lazy-dom's own code (e.g. Element.dispatchEvent).
      for (const name of Object.keys(classes)) {
        expect(
          (global as Record<string, unknown>)[name],
          `${name} should be on global after lazyDom()`
        ).to.not.be.undefined
      }

      // But window and document instances must NOT be on the process
      // global — they would leak per-environment DOM state.
      expect(
        (global as Record<string, unknown>).window,
        'window instance should not be overwritten on process global'
      ).to.not.have.property('documentStore')
    })
  })

  describe('classes export', () => {
    it('exports ShadowRoot in the classes object', () => {
      const { classes } = lazyDom()
      expect(classes).to.have.property('ShadowRoot')
      expect(typeof classes.ShadowRoot).to.equal('function')
    })
  })
})
