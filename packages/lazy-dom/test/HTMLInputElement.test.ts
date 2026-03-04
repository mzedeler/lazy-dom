import { expect } from 'chai'

describe('HTMLInputElement', () => {
  afterEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('files', () => {
    it('returns null for file inputs', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'file'
      expect(input.files).to.equal(null)
    })

    it('returns null for non-file inputs', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'text'
      expect(input.files).to.equal(null)
    })

    it('is writable (allows user-event Object.defineProperty override)', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'file'
      // user-event uses Object.defineProperty to set files
      Object.defineProperty(input, 'files', {
        configurable: true,
        value: [],
      })
      expect(input.files).to.deep.equal([])
    })
  })

  describe('form', () => {
    it('returns the closest form ancestor', () => {
      const form = document.createElement('form')
      const input = document.createElement('input')
      form.appendChild(input)
      document.body.appendChild(form)

      expect(input.form).to.equal(form)
    })

    it('returns null when not inside a form', () => {
      const input = document.createElement('input')
      document.body.appendChild(input)

      expect(input.form).to.equal(null)
    })
  })
})
