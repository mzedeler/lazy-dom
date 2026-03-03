import { expect } from 'chai'
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from './reflectAttributes'

describe('reflectAttributes', () => {
  describe('defineStringReflections', () => {
    it('defines a getter that returns attribute value', () => {
      const el = document.createElement('div')
      el.setAttribute('data-x', 'hello')
      defineStringReflections(el.constructor.prototype, [['dataX', 'data-x']])
      expect((el as unknown as { dataX: string }).dataX).to.equal('hello')
    })

    it('returns default value when attribute is not set', () => {
      const el = document.createElement('div')
      defineStringReflections(el.constructor.prototype, [['dataY', 'data-y', 'fallback']])
      expect((el as unknown as { dataY: string }).dataY).to.equal('fallback')
    })

    it('returns empty string as default when no default specified', () => {
      const el = document.createElement('div')
      defineStringReflections(el.constructor.prototype, [['dataZ', 'data-z']])
      expect((el as unknown as { dataZ: string }).dataZ).to.equal('')
    })

    it('defines a setter that sets the attribute', () => {
      const el = document.createElement('div')
      defineStringReflections(el.constructor.prototype, [['dataW', 'data-w']]);
      (el as unknown as { dataW: string }).dataW = 'world'
      expect(el.getAttribute('data-w')).to.equal('world')
    })
  })

  describe('defineBooleanReflections', () => {
    it('returns true when attribute is present', () => {
      const el = document.createElement('span')
      el.setAttribute('data-flag', '')
      defineBooleanReflections(el.constructor.prototype, [['dataFlag', 'data-flag']])
      expect((el as unknown as { dataFlag: boolean }).dataFlag).to.equal(true)
    })

    it('returns false when attribute is absent', () => {
      const el = document.createElement('span')
      defineBooleanReflections(el.constructor.prototype, [['dataFlag2', 'data-flag2']])
      expect((el as unknown as { dataFlag2: boolean }).dataFlag2).to.equal(false)
    })

    it('sets attribute when value is true', () => {
      const el = document.createElement('span');
      defineBooleanReflections(el.constructor.prototype, [['dataFlag3', 'data-flag3']]);
      (el as unknown as { dataFlag3: boolean }).dataFlag3 = true
      expect(el.hasAttribute('data-flag3')).to.equal(true)
    })

    it('removes attribute when value is false', () => {
      const el = document.createElement('span')
      el.setAttribute('data-flag4', '')
      defineBooleanReflections(el.constructor.prototype, [['dataFlag4', 'data-flag4']]);
      (el as unknown as { dataFlag4: boolean }).dataFlag4 = false
      expect(el.hasAttribute('data-flag4')).to.equal(false)
    })
  })

  describe('defineNumericReflections', () => {
    it('returns parsed integer from attribute', () => {
      const el = document.createElement('p')
      el.setAttribute('data-count', '42')
      defineNumericReflections(el.constructor.prototype, [['dataCount', 'data-count']])
      expect((el as unknown as { dataCount: number }).dataCount).to.equal(42)
    })

    it('returns default when attribute is absent', () => {
      const el = document.createElement('p')
      defineNumericReflections(el.constructor.prototype, [['dataNum', 'data-num', 10]])
      expect((el as unknown as { dataNum: number }).dataNum).to.equal(10)
    })

    it('returns 0 as default when no default specified', () => {
      const el = document.createElement('p')
      defineNumericReflections(el.constructor.prototype, [['dataVal', 'data-val']])
      expect((el as unknown as { dataVal: number }).dataVal).to.equal(0)
    })

    it('sets attribute as string representation of number', () => {
      const el = document.createElement('p')
      defineNumericReflections(el.constructor.prototype, [['dataSet', 'data-set']]);
      (el as unknown as { dataSet: number }).dataSet = 99
      expect(el.getAttribute('data-set')).to.equal('99')
    })

    it('returns default for non-numeric attribute values', () => {
      const el = document.createElement('p')
      el.setAttribute('data-nan', 'abc')
      defineNumericReflections(el.constructor.prototype, [['dataNan', 'data-nan', 5]])
      expect((el as unknown as { dataNan: number }).dataNan).to.equal(5)
    })
  })
})
