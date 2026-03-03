import { expect } from 'chai'

describe('HTMLTextAreaElement', () => {
  describe('setSelectionRange()', () => {
    it('sets selectionStart and selectionEnd', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.setSelectionRange(2, 5)

      expect(textarea.selectionStart).to.eq(2)
      expect(textarea.selectionEnd).to.eq(5)
    })

    it('defaults selectionDirection to none', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement
      textarea.setSelectionRange(0, 3)

      expect(textarea.selectionDirection).to.eq('none')
    })

    it('accepts a direction parameter', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement
      textarea.setSelectionRange(1, 4, 'forward')

      expect(textarea.selectionDirection).to.eq('forward')
    })

    it('accepts backward direction', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement
      textarea.setSelectionRange(1, 4, 'backward')

      expect(textarea.selectionDirection).to.eq('backward')
    })

    it('selectionStart and selectionEnd default to 0', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement

      expect(textarea.selectionStart).to.eq(0)
      expect(textarea.selectionEnd).to.eq(0)
    })
  })

  describe('setRangeText()', () => {
    it('replaces text within the selection range', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.setRangeText('there', 6, 11)

      expect(textarea.value).to.eq('hello there')
    })

    it('uses current selection when start/end not provided', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.setSelectionRange(6, 11)
      textarea.setRangeText('there')

      expect(textarea.value).to.eq('hello there')
    })
  })

  describe('select()', () => {
    it('sets selection to cover the entire value', () => {
      const textarea = document.createElement('textarea') as HTMLTextAreaElement
      textarea.value = 'hello'
      textarea.select()

      expect(textarea.selectionStart).to.eq(0)
      expect(textarea.selectionEnd).to.eq(5)
    })
  })
})
