import { expect } from 'chai'

describe('DOMTokenList', () => {
  afterEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('add', () => {
    it('adds a single class', () => {
      const el = document.createElement('div')
      el.classList.add('foo')
      expect(el.className).to.equal('foo')
    })

    it('adds multiple classes at once', () => {
      const el = document.createElement('div')
      el.classList.add('foo', 'bar', 'baz')
      expect(el.classList.contains('foo')).to.equal(true)
      expect(el.classList.contains('bar')).to.equal(true)
      expect(el.classList.contains('baz')).to.equal(true)
    })

    it('does not duplicate classes when adding multiple', () => {
      const el = document.createElement('div')
      el.classList.add('foo')
      el.classList.add('foo', 'bar')
      const classes = el.className.split(/\s+/)
      expect(classes.filter(c => c === 'foo')).to.have.length(1)
      expect(classes).to.include('bar')
    })
  })

  describe('remove', () => {
    it('removes a single class', () => {
      const el = document.createElement('div')
      el.classList.add('foo', 'bar')
      el.classList.remove('foo')
      expect(el.classList.contains('foo')).to.equal(false)
      expect(el.classList.contains('bar')).to.equal(true)
    })

    it('removes multiple classes at once', () => {
      const el = document.createElement('div')
      el.classList.add('foo', 'bar', 'baz')
      el.classList.remove('foo', 'baz')
      expect(el.classList.contains('foo')).to.equal(false)
      expect(el.classList.contains('bar')).to.equal(true)
      expect(el.classList.contains('baz')).to.equal(false)
    })
  })
})
