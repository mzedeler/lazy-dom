import { expect } from 'chai'
import lazyDom from './lazyDom'

describe('lazyDom', () => {
  describe('cleanup', () => {
    it('cleanup does not remove class constructors from process global', () => {
      const { classes, cleanup } = lazyDom()

      // Classes should be on the process global after lazyDom()
      for (const name of Object.keys(classes)) {
        expect(
          (global as Record<string, unknown>)[name],
          `${name} should be on global after lazyDom()`
        ).to.not.be.undefined
      }

      cleanup()

      // After cleanup, classes must STILL be on the process global.
      // Removing them races with setupFilesAfterEnv scripts like jest-canvas-mock.
      for (const name of Object.keys(classes)) {
        expect(
          (global as Record<string, unknown>)[name],
          `${name} should still be on global after cleanup()`
        ).to.not.be.undefined
      }
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
