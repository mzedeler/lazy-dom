import { expect } from 'chai'
import { parseQualifiedName, validateNamespace } from './validateNamespace'

describe('validateNamespace', () => {
  describe('parseQualifiedName', () => {
    it('returns null prefix for unprefixed names', () => {
      const result = parseQualifiedName('div')
      expect(result).to.deep.equal({ prefix: null, localName: 'div' })
    })

    it('splits prefix and localName on colon', () => {
      const result = parseQualifiedName('xml:lang')
      expect(result).to.deep.equal({ prefix: 'xml', localName: 'lang' })
    })

    it('handles xmlns prefix', () => {
      const result = parseQualifiedName('xmlns:xlink')
      expect(result).to.deep.equal({ prefix: 'xmlns', localName: 'xlink' })
    })
  })

  describe('validateNamespace', () => {
    it('throws when prefix is non-null but namespace is null', () => {
      expect(() => validateNamespace('foo', null, 'foo:bar'))
        .to.throw('Namespace is null but prefix is not null.')
    })

    it('throws when xml prefix has wrong namespace', () => {
      expect(() => validateNamespace('xml', 'http://wrong.ns/', 'xml:lang'))
        .to.throw("Prefix 'xml' requires namespace")
    })

    it('does not throw for correct xml prefix', () => {
      expect(() => validateNamespace('xml', 'http://www.w3.org/XML/1998/namespace', 'xml:lang'))
        .to.not.throw()
    })

    it('throws when xmlns qualified name has wrong namespace', () => {
      expect(() => validateNamespace(null, 'http://wrong.ns/', 'xmlns'))
        .to.throw("'xmlns' requires namespace")
    })

    it('throws when xmlns prefix has wrong namespace', () => {
      expect(() => validateNamespace('xmlns', 'http://wrong.ns/', 'xmlns:xlink'))
        .to.throw("Prefix 'xmlns' requires namespace")
    })

    it('does not throw for correct xmlns prefix', () => {
      expect(() => validateNamespace('xmlns', 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink'))
        .to.not.throw()
    })

    it('skips xmlns checks when checkXmlns is false', () => {
      expect(() => validateNamespace(null, 'http://wrong.ns/', 'xmlns', false))
        .to.not.throw()
      expect(() => validateNamespace('xmlns', 'http://wrong.ns/', 'xmlns:xlink', false))
        .to.not.throw()
    })

    it('still checks xml prefix when checkXmlns is false', () => {
      expect(() => validateNamespace('xml', 'http://wrong.ns/', 'xml:lang', false))
        .to.throw("Prefix 'xml' requires namespace")
    })

    it('allows null prefix with null namespace', () => {
      expect(() => validateNamespace(null, null, 'div')).to.not.throw()
    })
  })
})
