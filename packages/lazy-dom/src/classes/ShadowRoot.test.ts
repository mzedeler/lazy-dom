import { expect } from 'chai'

describe('ShadowRoot', () => {
  it('attachShadow returns a ShadowRoot with open mode', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'open' })
    expect(shadow).to.not.be.undefined
    expect(shadow.mode).to.equal('open')
    expect(shadow.host).to.equal(el)
  })

  it('attachShadow returns a ShadowRoot with closed mode', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'closed' })
    expect(shadow).to.not.be.undefined
    expect(shadow.mode).to.equal('closed')
    expect(shadow.host).to.equal(el)
  })

  it('element.shadowRoot returns the shadow for open mode', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'open' })
    expect(el.shadowRoot).to.equal(shadow)
  })

  it('element.shadowRoot returns null for closed mode', () => {
    const el = document.createElement('div')
    el.attachShadow({ mode: 'closed' })
    expect(el.shadowRoot).to.be.null
  })

  it('element.shadowRoot returns null when no shadow attached', () => {
    const el = document.createElement('div')
    expect(el.shadowRoot).to.be.null
  })

  it('throws when attaching a second shadow root', () => {
    const el = document.createElement('div')
    el.attachShadow({ mode: 'open' })
    expect(() => el.attachShadow({ mode: 'open' })).to.throw()
  })

  it('supports appendChild and child access', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'open' })
    const child = document.createElement('span')
    shadow.appendChild(child)
    expect(shadow.childNodes.length).to.equal(1)
    expect(shadow.firstChild).to.equal(child)
  })

  it('supports innerHTML getter and setter', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'open' })
    shadow.innerHTML = '<p>Hello</p>'
    expect(shadow.childNodes.length).to.equal(1)
    expect(shadow.innerHTML).to.equal('<p>Hello</p>')
  })

  it('supports adoptedStyleSheets property', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'open' })
    expect(shadow.adoptedStyleSheets).to.deep.equal([])
    shadow.adoptedStyleSheets = []
    expect(shadow.adoptedStyleSheets).to.deep.equal([])
  })

  it('querySelector works within shadow root', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'open' })
    shadow.innerHTML = '<div class="inner"><span>text</span></div>'
    const inner = shadow.querySelector('.inner')
    expect(inner).to.not.be.null
    expect(inner!.tagName).to.equal('DIV')
  })

  it('querySelectorAll works within shadow root', () => {
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'open' })
    shadow.innerHTML = '<p>a</p><p>b</p>'
    const paragraphs = shadow.querySelectorAll('p')
    expect(paragraphs.length).to.equal(2)
  })
})
