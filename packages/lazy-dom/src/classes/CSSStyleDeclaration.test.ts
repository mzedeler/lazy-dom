
import { expect } from 'chai'

describe('CSSStyleDeclaration', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('undefined handling', () => {
    it('does not store undefined as the string "undefined"', () => {
      const div = document.createElement('div')
      div.style.overflow = undefined as unknown as string
      expect(div.style.overflow).to.equal('')
    })

    it('does not include undefined values in cssText', () => {
      const div = document.createElement('div')
      div.style.overflow = undefined as unknown as string
      expect(div.style.cssText).to.equal('')
    })

    it('removes a previously set property when set to undefined', () => {
      const div = document.createElement('div')
      div.style.overflow = 'hidden'
      expect(div.style.overflow).to.equal('hidden')
      div.style.overflow = undefined as unknown as string
      expect(div.style.overflow).to.equal('')
    })
  })
})
