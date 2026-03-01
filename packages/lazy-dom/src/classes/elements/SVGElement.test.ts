import { expect } from 'chai'

describe('SVGElement', () => {
  it('createElementNS with SVG namespace returns instanceof SVGElement', () => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    expect(el).to.be.instanceOf(SVGElement)
  })
})
