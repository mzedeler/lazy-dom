import { expect } from 'chai'

describe('HTMLCanvasElement', () => {
  it('has default width of 300 and height of 150', () => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement

    expect(canvas.width).to.eq(300)
    expect(canvas.height).to.eq(150)
  })

  describe('getContext', () => {
    it('getContext("2d") returns a non-null object with canvas pointing back', () => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement
      const ctx = canvas.getContext('2d')

      expect(ctx).to.not.be.null
      expect(ctx!.canvas).to.eq(canvas)
    })

    it('getContext("2d") returns object with drawing methods', () => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement
      const ctx = canvas.getContext('2d')!

      expect(ctx.beginPath).to.be.instanceOf(Function)
      expect(ctx.fill).to.be.instanceOf(Function)
      expect(ctx.stroke).to.be.instanceOf(Function)
      expect(ctx.fillRect).to.be.instanceOf(Function)
      expect(ctx.clearRect).to.be.instanceOf(Function)
      expect(ctx.moveTo).to.be.instanceOf(Function)
      expect(ctx.lineTo).to.be.instanceOf(Function)
      expect(ctx.arc).to.be.instanceOf(Function)
    })

    it('getContext("webgl") returns null', () => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement
      const ctx = canvas.getContext('webgl')

      expect(ctx).to.be.null
    })
  })

  describe('toDataURL', () => {
    it('returns "data:,"', () => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement

      expect(canvas.toDataURL()).to.eq('data:,')
    })
  })

  describe('toBlob', () => {
    it('does not throw', () => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement

      expect(() => canvas.toBlob(() => { /* no-op */ })).to.not.throw()
    })
  })
})
