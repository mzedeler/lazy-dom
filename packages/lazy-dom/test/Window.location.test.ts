import { expect } from 'chai'

describe('Window.location', () => {
  it('has a default href', () => {
    expect(window.location.href).to.equal('http://localhost/')
  })

  it('parses protocol, hostname, pathname, origin', () => {
    expect(window.location.protocol).to.equal('http:')
    expect(window.location.hostname).to.equal('localhost')
    expect(window.location.pathname).to.equal('/')
    expect(window.location.origin).to.equal('http://localhost')
  })

  it('has host and port properties', () => {
    expect(window.location.host).to.equal('localhost')
    expect(window.location.port).to.equal('')
  })

  it('updates all fields when href is set', () => {
    const original = window.location.href
    try {
      window.location.href = 'https://example.com:8080/path?q=1#hash'
      expect(window.location.protocol).to.equal('https:')
      expect(window.location.hostname).to.equal('example.com')
      expect(window.location.pathname).to.equal('/path')
      expect(window.location.search).to.equal('?q=1')
      expect(window.location.hash).to.equal('#hash')
      expect(window.location.host).to.equal('example.com:8080')
      expect(window.location.port).to.equal('8080')
      expect(window.location.origin).to.equal('https://example.com:8080')
    } finally {
      window.location.href = original
    }
  })

  it('resolves relative URLs against current href', () => {
    const original = window.location.href
    try {
      window.location.href = 'http://localhost/base/'
      window.location.href = 'relative/path'
      expect(window.location.href).to.equal('http://localhost/base/relative/path')
      expect(window.location.pathname).to.equal('/base/relative/path')
    } finally {
      window.location.href = original
    }
  })
})
