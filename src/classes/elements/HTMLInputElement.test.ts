import { expect } from 'chai'

describe('HTMLInputElement', () => {
  describe('select()', () => {
    it('has select as a function', () => {
      const input = document.createElement('input') as HTMLInputElement

      expect(input.select).to.be.instanceOf(Function)
    })

    it('select() does not throw', () => {
      const input = document.createElement('input') as HTMLInputElement

      expect(() => input.select()).not.to.throw
    })
  })
})
