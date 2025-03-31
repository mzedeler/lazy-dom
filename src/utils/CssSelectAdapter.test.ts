import { expect } from 'chai'
import { CssSelectAdapter } from './CssSelectAdapter'
import * as CSSselect from 'css-select'

describe('CssSelectAdapter', () => {
  describe('selectOne', () => {
    it('supports tagName selector', () => {
      const adapter = new CssSelectAdapter()
      const div = document.createElement('div')
      document.body.appendChild(div)
  
      const result = CSSselect.selectOne('div', document.body, { adapter })
  
      expect(result).to.eq(div)
    })
  
    it('supports class selector', () => {
      const adapter = new CssSelectAdapter()
      const div = document.createElement('div')
      div.setAttribute('class', 'some-class')
      document.body.appendChild(div)
  
      const result = CSSselect.selectOne('.some-class', document.body, { adapter })
  
      expect(result).to.eq(div)
    })

    it('supports id selector', () => {
      const adapter = new CssSelectAdapter()
      const div = document.createElement('div')
      div.setAttribute('id', 'some-id')
      document.body.appendChild(div)
  
      const result = CSSselect.selectOne('#some-id', document.body, { adapter })
  
      expect(result).to.eq(div)
    })
  })
})
