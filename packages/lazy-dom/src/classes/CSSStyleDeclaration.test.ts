
import { expect } from 'chai'

describe('CSSStyleDeclaration', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('cssText serialization', () => {
    it('includes trailing semicolons on each property', () => {
      const div = document.createElement('div')
      div.style.color = 'red'
      expect(div.style.cssText).to.eq('color: red;')
    })

    it('separates multiple properties with space', () => {
      const div = document.createElement('div')
      div.style.color = 'red'
      div.style.setProperty('text-decoration', 'none')
      expect(div.style.cssText).to.eq('color: red; text-decoration: none;')
    })

    it('getAttribute returns raw attribute value when set via setAttribute', function () {
      if (!globalThis.__LAZY_DOM__) this.skip()
      const div = document.createElement('div')
      div.setAttribute('style', 'color:red;width:30px')
      expect(div.getAttribute('style')).to.eq('color:red;width:30px')
      expect(div.style.color).to.eq('red')
      expect(div.style.width).to.eq('30px')
    })

    it('getAttribute returns cssText when style set via JS API', function () {
      if (!globalThis.__LAZY_DOM__) this.skip()
      const div = document.createElement('div')
      div.style.color = 'red'
      expect(div.getAttribute('style')).to.eq('color: red;')
    })

    it('normalizes 0 to 0px for length properties', function () {
      if (!globalThis.__LAZY_DOM__) this.skip()
      const div = document.createElement('div')
      div.style.left = '0'
      expect(div.style.left).to.eq('0px')
    })
  })

  describe('CSS property filtering', () => {
    it('silently ignores non-standard properties via proxy', () => {
      const div = document.createElement('div')
      const style = div.style as unknown as Record<string, string>
      style.label = 'myComponent'
      expect(div.style.cssText).to.eq('')
      expect(style.label).to.eq('myComponent')
    })

    it('silently ignores non-standard properties via setProperty', () => {
      const div = document.createElement('div')
      div.style.setProperty('label', 'myComponent')
      expect(div.style.cssText).to.eq('')
    })

    it('allows standard CSS properties', () => {
      const div = document.createElement('div')
      div.style.color = 'red'
      expect(div.style.color).to.eq('red')
    })

    it('allows CSS custom properties (--*)', () => {
      const div = document.createElement('div')
      div.style.setProperty('--my-color', 'blue')
      expect(div.style.getPropertyValue('--my-color')).to.eq('blue')
    })

    it('preserves camelCase CSS custom property values verbatim', () => {
      const div = document.createElement('div')
      div.style.setProperty('--someColor', '#000000')
      expect(div.style.getPropertyValue('--someColor')).to.eq('#000000')
    })

    it('does not normalize hex colors in custom properties', () => {
      const div = document.createElement('div')
      div.style.setProperty('--theme-primary', '#ff0000')
      expect(div.style.getPropertyValue('--theme-primary')).to.eq('#ff0000')
    })

    it('silently ignores vendor-prefixed properties via setProperty', () => {
      const div = document.createElement('div')
      div.style.setProperty('-webkit-transform', 'none')
      expect(div.style.getPropertyValue('-webkit-transform')).to.eq('')
      expect(div.style.cssText).to.eq('')
    })
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

    it('removes a previously set property when set to undefined', function () {
      // JSDOM does not clear a style property when set to undefined
      if (!globalThis.__LAZY_DOM__) this.skip()
      const div = document.createElement('div')
      div.style.overflow = 'hidden'
      expect(div.style.overflow).to.equal('hidden')
      div.style.overflow = undefined as unknown as string
      expect(div.style.overflow).to.equal('')
    })
  })
})
