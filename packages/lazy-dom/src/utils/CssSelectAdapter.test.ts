import { expect } from 'chai'
import * as CSSselect from 'css-select'
import { CssSelectAdapter } from './CssSelectAdapter'
import { div } from './div'

describe('CssSelectAdapter', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  beforeEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('selectOne', () => {
    it('supports tagName selector', () => {
      const adapter = new CssSelectAdapter()
      const root = document.createElement('div')
      document.body.appendChild(root)
  
      const result = CSSselect.selectOne('div', document.body, { adapter })
  
      expect(result).to.eq(root)
    })
  
    it('supports class selector', () => {
      const adapter = new CssSelectAdapter()
      const root = document.createElement('div')
      root.setAttribute('class', 'some-class')
      document.body.appendChild(root)
  
      const result = CSSselect.selectOne('.some-class', document.body, { adapter })
  
      expect(result).to.eq(root)
    })

    it('supports id selector', () => {
      const adapter = new CssSelectAdapter()
      const root = document.createElement('div')
      root.setAttribute('id', 'some-id-1')
      document.body.appendChild(root)
  
      const result = CSSselect.selectOne('#some-id-1', document.body, { adapter })
  
      expect(result).to.eq(root)
    })

    it('can select grandchild nodes', () => {
      const adapter = new CssSelectAdapter()
      const grandchild = document.createElement('span')
      document.body.appendChild(div('root', div('parent', grandchild)))
  
      const result = CSSselect.selectOne('span', document.body, { adapter })
  
      expect(result).to.eq(grandchild)
    })
  })
})
