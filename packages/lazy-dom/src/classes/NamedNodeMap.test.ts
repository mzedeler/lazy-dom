import { Element } from "./Element"
import { NamedNodeMap } from "./NamedNodeMap"
import { Attr } from './Attr'
import { expect } from 'chai'

describe('NamedNodeMap', () => {
  it('supports Array.from(namedNodeMap)', () => {
    const element = new Element()
    const namedNodeMap = new NamedNodeMap()
    const attr = new Attr(element, 'alt', 'hello')
    namedNodeMap.setNamedItem(attr)

    expect(Array.from(namedNodeMap)).to.eql([attr])
  })

  describe('Attr', () => {
    describe('toJSON', () => {
      it('does not throw on JSON.stringify when ownerElement is set', () => {
        const element = new Element()
        const attr = new Attr(element, 'alt', 'hello')
        expect(() => JSON.stringify(attr)).not.to.throw
      })

      it('excludes ownerElement from JSON output', () => {
        const element = new Element()
        const attr = new Attr(element, 'alt', 'hello')
        const json = JSON.parse(JSON.stringify(attr))
        expect(json).not.to.have.property('ownerElement')
        expect(json).to.have.property('name', 'alt')
        expect(json).to.have.property('value', 'hello')
      })
    })
  })
})
