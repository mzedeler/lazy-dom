import { expect } from 'chai'

describe('Document', () => {
  describe('scrollingElement', () => {
    it('returns the documentElement', () => {
      expect(document.scrollingElement).to.equal(document.documentElement)
    })

    it('is defined', () => {
      expect(document).to.have.property('scrollingElement')
    })
  })
})
