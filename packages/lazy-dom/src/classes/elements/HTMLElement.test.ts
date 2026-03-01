
import { expect } from 'chai'

describe('HTMLElement', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('offset stubs', () => {
    it('offsetWidth returns 0', () => {
      const div = document.createElement('div')
      expect(div.offsetWidth).to.equal(0)
    })

    it('offsetHeight returns 0', () => {
      const div = document.createElement('div')
      expect(div.offsetHeight).to.equal(0)
    })

    it('offsetTop returns 0', () => {
      const div = document.createElement('div')
      expect(div.offsetTop).to.equal(0)
    })

    it('offsetLeft returns 0', () => {
      const div = document.createElement('div')
      expect(div.offsetLeft).to.equal(0)
    })

    it('offsetParent returns null', () => {
      const div = document.createElement('div')
      expect(div.offsetParent).to.equal(null)
    })
  })
})
