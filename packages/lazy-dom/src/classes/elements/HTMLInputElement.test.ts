import { expect } from 'chai'

describe('HTMLInputElement', () => {
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

  describe('setSelectionRange()', () => {
    it('sets selectionStart and selectionEnd', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.value = 'hello world'
      input.setSelectionRange(2, 5)

      expect(input.selectionStart).to.eq(2)
      expect(input.selectionEnd).to.eq(5)
    })

    it('defaults selectionDirection to none', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setSelectionRange(0, 3)

      expect(input.selectionDirection).to.eq('none')
    })

    it('accepts a direction parameter', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setSelectionRange(1, 4, 'forward')

      expect(input.selectionDirection).to.eq('forward')
    })

    it('accepts backward direction', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.setSelectionRange(1, 4, 'backward')

      expect(input.selectionDirection).to.eq('backward')
    })

    it('selectionStart and selectionEnd default to 0', () => {
      const input = document.createElement('input') as HTMLInputElement

      expect(input.selectionStart).to.eq(0)
      expect(input.selectionEnd).to.eq(0)
    })
  })

  describe('setRangeText()', () => {
    it('replaces text within the selection range', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.value = 'hello world'
      input.setRangeText('there', 6, 11)

      expect(input.value).to.eq('hello there')
    })

    it('uses current selection when start/end not provided', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.value = 'hello world'
      input.setSelectionRange(6, 11)
      input.setRangeText('there')

      expect(input.value).to.eq('hello there')
    })

    it('supports select mode', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.value = 'hello world'
      input.setRangeText('there', 6, 11, 'select')

      expect(input.selectionStart).to.eq(6)
      expect(input.selectionEnd).to.eq(11)
    })

    it('supports start mode', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.value = 'hello world'
      input.setRangeText('there', 6, 11, 'start')

      expect(input.selectionStart).to.eq(6)
      expect(input.selectionEnd).to.eq(6)
    })

    it('supports end mode', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.value = 'hello world'
      input.setRangeText('there', 6, 11, 'end')

      expect(input.selectionStart).to.eq(11)
      expect(input.selectionEnd).to.eq(11)
    })
  })

  describe('select()', () => {
    it('sets selection to cover the entire value', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.value = 'hello'
      input.select()

      expect(input.selectionStart).to.eq(0)
      expect(input.selectionEnd).to.eq(5)
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
