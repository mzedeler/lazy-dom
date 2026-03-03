import { expect } from 'chai'

describe('Range', () => {
  describe('comparePoint()', () => {
    it('returns 0 when point is inside the range', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 2)
      range.setEnd(text, 8)

      expect(range.comparePoint(text, 5)).to.eq(0)
    })

    it('returns -1 when point is before the range', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 5)
      range.setEnd(text, 8)

      expect(range.comparePoint(text, 2)).to.eq(-1)
    })

    it('returns 1 when point is after the range', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 2)
      range.setEnd(text, 5)

      expect(range.comparePoint(text, 8)).to.eq(1)
    })

    it('returns 0 when point is at the start boundary', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 3)
      range.setEnd(text, 7)

      expect(range.comparePoint(text, 3)).to.eq(0)
    })

    it('returns 0 when point is at the end boundary', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 3)
      range.setEnd(text, 7)

      expect(range.comparePoint(text, 7)).to.eq(0)
    })

    it('works with element nodes as containers', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      const span2 = document.createElement('span')
      const span3 = document.createElement('span')
      div.appendChild(span1)
      div.appendChild(span2)
      div.appendChild(span3)

      const range = document.createRange()
      range.setStart(div, 1)
      range.setEnd(div, 2)

      expect(range.comparePoint(div, 0)).to.eq(-1)
      expect(range.comparePoint(div, 1)).to.eq(0)
      expect(range.comparePoint(div, 2)).to.eq(0)
      expect(range.comparePoint(div, 3)).to.eq(1)
    })

    it('works with different containers in the same tree', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      const text1 = document.createTextNode('abc')
      const span2 = document.createElement('span')
      const text2 = document.createTextNode('def')
      span1.appendChild(text1)
      span2.appendChild(text2)
      div.appendChild(span1)
      div.appendChild(span2)

      const range = document.createRange()
      range.setStart(text1, 1)
      range.setEnd(text2, 2)

      // Point in text1 before range start
      expect(range.comparePoint(text1, 0)).to.eq(-1)
      // Point in text2 after range end
      expect(range.comparePoint(text2, 3)).to.eq(1)
      // Point inside range
      expect(range.comparePoint(text1, 2)).to.eq(0)
      expect(range.comparePoint(text2, 1)).to.eq(0)
    })
  })

  describe('toString()', () => {
    it('returns text within a single text node', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 2)
      range.setEnd(text, 7)

      expect(range.toString()).to.eq('llo w')
    })

    it('returns text across multiple text nodes', () => {
      const div = document.createElement('div')
      const text1 = document.createTextNode('hello ')
      const text2 = document.createTextNode('world')
      div.appendChild(text1)
      div.appendChild(text2)

      const range = document.createRange()
      range.setStart(text1, 3)
      range.setEnd(text2, 3)

      expect(range.toString()).to.eq('lo wor')
    })

    it('returns text across elements', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      span1.textContent = 'foo'
      const span2 = document.createElement('span')
      span2.textContent = 'bar'
      div.appendChild(span1)
      div.appendChild(span2)

      const range = document.createRange()
      range.setStart(span1.firstChild!, 1)
      range.setEnd(span2.firstChild!, 2)

      expect(range.toString()).to.eq('ooba')
    })

    it('returns empty string for collapsed range', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 3)
      range.setEnd(text, 3)

      expect(range.toString()).to.eq('')
    })

    it('handles element container with child offsets (same container)', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      span1.textContent = 'aaa'
      const span2 = document.createElement('span')
      span2.textContent = 'bbb'
      const span3 = document.createElement('span')
      span3.textContent = 'ccc'
      div.appendChild(span1)
      div.appendChild(span2)
      div.appendChild(span3)

      const range = document.createRange()
      range.setStart(div, 1)
      range.setEnd(div, 3)

      expect(range.toString()).to.eq('bbbccc')
    })

    it('handles element start container with child offset', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      span1.textContent = 'aaa'
      const span2 = document.createElement('span')
      const text2 = document.createTextNode('bbb')
      span2.appendChild(text2)
      div.appendChild(span1)
      div.appendChild(span2)

      const range = document.createRange()
      range.setStart(div, 1)
      range.setEnd(text2, 2)

      expect(range.toString()).to.eq('bb')
    })
  })

  describe('insertNode()', () => {
    it('inserts a node into a text node, splitting it', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 5)
      range.setEnd(text, 5)

      const span = document.createElement('span')
      span.textContent = '!'
      range.insertNode(span)

      expect(div.childNodes.length).to.eq(3)
      expect(div.childNodes[0].textContent).to.eq('hello')
      expect(div.childNodes[1].textContent).to.eq('!')
      expect(div.childNodes[2].textContent).to.eq(' world')
    })

    it('inserts a node at a child offset in an element', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      const span2 = document.createElement('span')
      div.appendChild(span1)
      div.appendChild(span2)

      const range = document.createRange()
      range.setStart(div, 1)
      range.setEnd(div, 1)

      const inserted = document.createElement('b')
      range.insertNode(inserted)

      expect(div.childNodes.length).to.eq(3)
      expect(div.childNodes[1].nodeName.toLowerCase()).to.eq('b')
    })
  })

  describe('isPointInRange()', () => {
    it('returns true when point is inside the range', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 1)
      range.setEnd(text, 4)

      expect(range.isPointInRange(text, 2)).to.be.true
    })

    it('returns false when point is outside the range', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 1)
      range.setEnd(text, 4)

      expect(range.isPointInRange(text, 0)).to.be.false
    })

    it('returns true at range boundaries', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 1)
      range.setEnd(text, 4)

      expect(range.isPointInRange(text, 1)).to.be.true
      expect(range.isPointInRange(text, 4)).to.be.true
    })
  })
})
