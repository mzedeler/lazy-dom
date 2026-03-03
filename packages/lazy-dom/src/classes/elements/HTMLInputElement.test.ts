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

  describe('value / defaultValue', () => {
    it('value returns the attribute value initially', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setAttribute('value', 'initial')

      expect(input.value).to.eq('initial')
    })

    it('setting value does not change the attribute', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setAttribute('value', 'initial')
      input.value = 'changed'

      expect(input.value).to.eq('changed')
      expect(input.getAttribute('value')).to.eq('initial')
    })

    it('defaultValue reflects the value attribute', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setAttribute('value', 'default')

      expect(input.defaultValue).to.eq('default')
    })

    it('setting defaultValue changes the attribute', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.defaultValue = 'newDefault'

      expect(input.getAttribute('value')).to.eq('newDefault')
    })

    it('value diverges from defaultValue after programmatic set', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setAttribute('value', 'original')
      input.value = 'modified'

      expect(input.value).to.eq('modified')
      expect(input.defaultValue).to.eq('original')
    })

    it('value returns empty string when no attribute and not set', () => {
      const input = document.createElement('input') as HTMLInputElement

      expect(input.value).to.eq('')
    })
  })

  describe('checked / defaultChecked', () => {
    it('checked reflects the checked attribute initially', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setAttribute('checked', '')

      expect(input.checked).to.be.true
    })

    it('checked is false when attribute is absent', () => {
      const input = document.createElement('input') as HTMLInputElement

      expect(input.checked).to.be.false
    })

    it('setting checked does not change the attribute', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.checked = true

      expect(input.checked).to.be.true
      expect(input.hasAttribute('checked')).to.be.false
    })

    it('defaultChecked reflects the checked attribute', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setAttribute('checked', '')

      expect(input.defaultChecked).to.be.true
    })

    it('setting defaultChecked changes the attribute', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.defaultChecked = true

      expect(input.hasAttribute('checked')).to.be.true
    })

    it('checked diverges from defaultChecked after programmatic set', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setAttribute('checked', '')
      input.checked = false

      expect(input.checked).to.be.false
      expect(input.defaultChecked).to.be.true
    })
  })

  describe('click() and dispatchEvent toggle', () => {
    it('toggles checked on checkbox via click()', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      expect(input.checked).to.be.false
      input.click()
      expect(input.checked).to.be.true
      input.click()
      expect(input.checked).to.be.false
    })

    it('sets checked to true on radio via click()', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'radio'
      expect(input.checked).to.be.false
      input.click()
      expect(input.checked).to.be.true
    })

    it('toggles checked on checkbox via dispatchEvent with MouseEvent', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      expect(input.checked).to.be.false
      input.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(input.checked).to.be.true
    })

    it('does not toggle checked on checkbox via dispatchEvent with plain Event', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      expect(input.checked).to.be.false
      input.dispatchEvent(new window.Event('click', { bubbles: true }))
      expect(input.checked).to.be.false
    })

    it('reverts toggle if click() event is cancelled', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      expect(input.checked).to.be.false
      input.addEventListener('click', (e: Event) => e.preventDefault())
      input.click()
      expect(input.checked).to.be.false
    })

    it('reverts toggle if dispatchEvent MouseEvent click is cancelled', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      expect(input.checked).to.be.false
      input.addEventListener('click', (e: Event) => e.preventDefault())
      input.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      expect(input.checked).to.be.false
    })

    it('does not toggle checked on text input', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'text'
      input.click()
      expect(input.checked).to.be.false
    })
  })

  describe('value default for checkbox/radio', () => {
    it('defaults to "on" for checkbox', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      expect(input.value).to.eq('on')
    })

    it('defaults to "on" for radio', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'radio'
      expect(input.value).to.eq('on')
    })

    it('uses attribute value when set for checkbox', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      input.setAttribute('value', 'yes')
      expect(input.value).to.eq('yes')
    })

    it('value always returns a string', () => {
      const input = document.createElement('input') as HTMLInputElement
      ;(input as unknown as Record<string, unknown>).value = 42
      expect(typeof input.value).to.eq('string')
      expect(input.value).to.eq('42')
    })
  })
})
