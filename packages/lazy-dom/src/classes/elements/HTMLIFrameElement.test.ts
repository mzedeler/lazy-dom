import { expect } from 'chai'

describe('HTMLIFrameElement', () => {
  // JSDOM only populates contentDocument/contentWindow for iframes attached to
  // the document. lazy-dom eagerly creates them even for detached iframes.
  it('has a contentDocument property', function () {
    if (!globalThis.__LAZY_DOM__) this.skip()
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    expect(iframe.contentDocument).to.not.be.null
  })

  it('contentDocument has a body', function () {
    if (!globalThis.__LAZY_DOM__) this.skip()
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    const doc = iframe.contentDocument!
    expect(doc.body).to.exist
  })

  it('contentDocument supports createElement', function () {
    if (!globalThis.__LAZY_DOM__) this.skip()
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    const doc = iframe.contentDocument!
    const div = doc.createElement('div')
    expect(div.tagName).to.eq('DIV')
  })

  it('contentWindow is not null', function () {
    if (!globalThis.__LAZY_DOM__) this.skip()
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    expect(iframe.contentWindow).to.not.be.null
  })

  it('returns the same contentDocument on repeated access', function () {
    if (!globalThis.__LAZY_DOM__) this.skip()
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    expect(iframe.contentDocument).to.eq(iframe.contentDocument)
  })
})
