import { expect } from 'chai'

describe('KeyboardEvent', () => {
  it('creates with correct type', () => {
    const event = new KeyboardEvent('keydown')

    expect(event.type).to.eq('keydown')
  })

  it('accepts KeyboardEventInit properties', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
      which: 13,
      ctrlKey: true,
    })

    expect(event.key).to.eq('Enter')
    expect(event.code).to.eq('Enter')
    expect(event.keyCode).to.eq(13)
    expect(event.charCode).to.eq(13)
    expect(event.which).to.eq(13)
    expect(event.ctrlKey).to.be.true
  })

  describe('prototype property descriptors', () => {
    it('charCode is defined on the prototype as a getter', () => {
      const desc = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'charCode')

      expect(desc).to.exist
      expect(desc!.get).to.be.instanceOf(Function)
    })

    it('keyCode is defined on the prototype as a getter', () => {
      const desc = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'keyCode')

      expect(desc).to.exist
      expect(desc!.get).to.be.instanceOf(Function)
    })

    it('which is defined on the prototype as a getter', () => {
      const desc = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'which')

      expect(desc).to.exist
      expect(desc!.get).to.be.instanceOf(Function)
    })

    it('code is defined on the prototype as a getter', () => {
      const desc = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'code')

      expect(desc).to.exist
      expect(desc!.get).to.be.instanceOf(Function)
    })
  })
})
