import { expect } from 'chai'

describe('HTMLIFrameElement', () => {
  it('has a contentDocument property', () => {
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    expect(iframe.contentDocument).to.not.be.null
  })

  it('contentDocument has a body', () => {
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    const doc = iframe.contentDocument!
    expect(doc.body).to.exist
  })

  it('contentDocument supports createElement', () => {
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    const doc = iframe.contentDocument!
    const div = doc.createElement('div')
    expect(div.tagName).to.eq('DIV')
  })

  it('contentWindow is not null', () => {
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    expect(iframe.contentWindow).to.not.be.null
  })

  it('returns the same contentDocument on repeated access', () => {
    const iframe = document.createElement('iframe') as HTMLIFrameElement
    expect(iframe.contentDocument).to.eq(iframe.contentDocument)
  })
})
