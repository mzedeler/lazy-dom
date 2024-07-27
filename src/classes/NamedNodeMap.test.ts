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
})
