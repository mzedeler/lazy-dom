import { expect } from 'chai'

describe('HTMLOListElement', () => {
  it('has start property defaulting to 1', () => {
    const ol = document.createElement('ol')
    expect(ol.start).to.equal(1)
  })

  it('reflects the start attribute', () => {
    const ol = document.createElement('ol')
    ol.setAttribute('start', '5')
    expect(ol.start).to.equal(5)
  })

  it('allows setting start programmatically', () => {
    const ol = document.createElement('ol') as HTMLOListElement
    ol.start = 10
    expect(ol.getAttribute('start')).to.equal('10')
  })
})
