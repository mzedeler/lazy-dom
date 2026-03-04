import { expect } from 'chai'

describe('Event constructors', () => {
  describe('UIEvent', () => {
    it('passes detail from init dict', () => {
      const evt = new UIEvent('click', { detail: 1, bubbles: true })
      expect(evt.detail).to.equal(1)
      expect(evt.bubbles).to.equal(true)
    })

    it('defaults detail to 0', () => {
      const evt = new UIEvent('click')
      expect(evt.detail).to.equal(0)
      expect(evt.view).to.equal(null)
    })

    it('passes view from init dict', () => {
      const view = window
      const evt = new UIEvent('click', { view })
      expect(evt.view).to.equal(view)
    })
  })

  describe('MouseEvent', () => {
    it('passes detail from init dict', () => {
      const evt = new MouseEvent('click', { detail: 2, bubbles: true })
      expect(evt.detail).to.equal(2)
      expect(evt.bubbles).to.equal(true)
    })

    it('preserves all MouseEvent properties alongside detail', () => {
      const evt = new MouseEvent('click', { detail: 1, clientX: 100, button: 0 })
      expect(evt.detail).to.equal(1)
      expect(evt.clientX).to.equal(100)
      expect(evt.button).to.equal(0)
    })
  })

  describe('PointerEvent', () => {
    it('passes detail from init dict', () => {
      const evt = new PointerEvent('click', { detail: 1, bubbles: true })
      expect(evt.detail).to.equal(1)
      expect(evt.bubbles).to.equal(true)
    })
  })

  describe('InputEvent', () => {
    it('passes data and inputType from init dict', () => {
      const evt = new InputEvent('beforeinput', {
        data: 'a',
        inputType: 'insertText',
        bubbles: true,
      })
      expect(evt.data).to.equal('a')
      expect(evt.inputType).to.equal('insertText')
      expect(evt.bubbles).to.equal(true)
    })

    it('defaults data to null and inputType to empty string', () => {
      const evt = new InputEvent('input')
      expect(evt.data).to.equal(null)
      expect(evt.inputType).to.equal('')
      expect(evt.isComposing).to.equal(false)
    })

    it('has getTargetRanges method', () => {
      const evt = new InputEvent('input')
      expect(evt.getTargetRanges()).to.deep.equal([])
    })

    it('passes isComposing from init dict', () => {
      const evt = new InputEvent('input', { isComposing: true })
      expect(evt.isComposing).to.equal(true)
    })
  })
})
