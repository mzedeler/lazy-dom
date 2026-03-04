import { expect } from 'chai'

describe('Range', () => {
  describe('constants', () => {
    it('has static constants', () => {
      expect(Range.START_TO_START).to.eq(0)
      expect(Range.START_TO_END).to.eq(1)
      expect(Range.END_TO_END).to.eq(2)
      expect(Range.END_TO_START).to.eq(3)
    })

    it('has instance constants', () => {
      const range = document.createRange()
      expect(range.START_TO_START).to.eq(0)
      expect(range.START_TO_END).to.eq(1)
      expect(range.END_TO_END).to.eq(2)
      expect(range.END_TO_START).to.eq(3)
    })
  })

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

  describe('compareBoundaryPoints()', () => {
    it('compares START_TO_START', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range1 = document.createRange()
      range1.setStart(text, 2)
      range1.setEnd(text, 8)

      const range2 = document.createRange()
      range2.setStart(text, 4)
      range2.setEnd(text, 10)

      expect(range1.compareBoundaryPoints(Range.START_TO_START, range2)).to.eq(-1)
      expect(range2.compareBoundaryPoints(Range.START_TO_START, range1)).to.eq(1)
      expect(range1.compareBoundaryPoints(Range.START_TO_START, range1)).to.eq(0)
    })

    it('compares END_TO_END', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range1 = document.createRange()
      range1.setStart(text, 0)
      range1.setEnd(text, 5)

      const range2 = document.createRange()
      range2.setStart(text, 0)
      range2.setEnd(text, 8)

      expect(range1.compareBoundaryPoints(Range.END_TO_END, range2)).to.eq(-1)
      expect(range2.compareBoundaryPoints(Range.END_TO_END, range1)).to.eq(1)
    })

    it('compares START_TO_END', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range1 = document.createRange()
      range1.setStart(text, 0)
      range1.setEnd(text, 5)

      const range2 = document.createRange()
      range2.setStart(text, 3)
      range2.setEnd(text, 8)

      // Compares range1.end with range2.start
      expect(range1.compareBoundaryPoints(Range.START_TO_END, range2)).to.eq(1)
    })

    it('compares END_TO_START', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range1 = document.createRange()
      range1.setStart(text, 5)
      range1.setEnd(text, 8)

      const range2 = document.createRange()
      range2.setStart(text, 0)
      range2.setEnd(text, 3)

      // Compares range1.start with range2.end
      expect(range1.compareBoundaryPoints(Range.END_TO_START, range2)).to.eq(1)
    })

    it('throws for invalid how value', () => {
      const range1 = document.createRange()
      const range2 = document.createRange()
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      range1.setStart(text, 0)
      range1.setEnd(text, 5)
      range2.setStart(text, 0)
      range2.setEnd(text, 5)

      expect(() => range1.compareBoundaryPoints(5, range2)).to.throw()
    })
  })

  describe('selectNodeContents()', () => {
    it('works with Text nodes', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)

      const range = document.createRange()
      range.selectNodeContents(text)

      expect(range.startContainer).to.eq(text)
      expect(range.startOffset).to.eq(0)
      expect(range.endContainer).to.eq(text)
      expect(range.endOffset).to.eq(5)
    })

    it('works with element nodes', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      const span2 = document.createElement('span')
      div.appendChild(span1)
      div.appendChild(span2)

      const range = document.createRange()
      range.selectNodeContents(div)

      expect(range.startOffset).to.eq(0)
      expect(range.endOffset).to.eq(2)
    })
  })

  describe('deleteContents()', () => {
    it('is a no-op when collapsed', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 3)
      range.setEnd(text, 3)

      range.deleteContents()
      expect(text.data).to.eq('hello')
    })

    it('deletes text within a single text node', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 5)
      range.setEnd(text, 11)

      range.deleteContents()
      expect(text.data).to.eq('hello')
      expect(range.collapsed).to.be.true
    })

    it('removes children from a single element container', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      const span2 = document.createElement('span')
      const span3 = document.createElement('span')
      div.appendChild(span1)
      div.appendChild(span2)
      div.appendChild(span3)

      const range = document.createRange()
      range.setStart(div, 1)
      range.setEnd(div, 3)

      range.deleteContents()
      expect(div.childNodes.length).to.eq(1)
      expect(div.childNodes[0]).to.eq(span1)
    })

    it('deletes across two text nodes in the same parent', () => {
      const div = document.createElement('div')
      const text1 = document.createTextNode('hello ')
      const text2 = document.createTextNode('world')
      div.appendChild(text1)
      div.appendChild(text2)

      const range = document.createRange()
      range.setStart(text1, 3)
      range.setEnd(text2, 3)

      range.deleteContents()
      expect(text1.data).to.eq('hel')
      expect(text2.data).to.eq('ld')
    })

    it('deletes across elements removing fully contained middle nodes', () => {
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
      range.setStart(span1.firstChild!, 1)
      range.setEnd(span3.firstChild!, 2)

      range.deleteContents()
      expect(span1.firstChild!.textContent).to.eq('a')
      expect(span3.firstChild!.textContent).to.eq('c')
      expect(div.childNodes.length).to.eq(2) // span2 removed
    })
  })

  describe('cloneContents()', () => {
    it('returns empty fragment for collapsed range', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 3)
      range.setEnd(text, 3)

      const frag = range.cloneContents()
      expect(frag.childNodes.length).to.eq(0)
    })

    it('clones text within a single text node', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 6)
      range.setEnd(text, 11)

      const frag = range.cloneContents()
      expect(frag.childNodes.length).to.eq(1)
      expect(frag.firstChild!.textContent).to.eq('world')
      // Original is unchanged
      expect(text.data).to.eq('hello world')
    })

    it('clones children from a single element container', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      span1.textContent = 'aaa'
      const span2 = document.createElement('span')
      span2.textContent = 'bbb'
      div.appendChild(span1)
      div.appendChild(span2)

      const range = document.createRange()
      range.setStart(div, 0)
      range.setEnd(div, 2)

      const frag = range.cloneContents()
      expect(frag.childNodes.length).to.eq(2)
      expect(frag.childNodes[0]!.textContent).to.eq('aaa')
      expect(frag.childNodes[1]!.textContent).to.eq('bbb')
      // Original is unchanged
      expect(div.childNodes.length).to.eq(2)
    })
  })

  describe('extractContents()', () => {
    it('extracts text within a single text node', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 5)
      range.setEnd(text, 11)

      const frag = range.extractContents()
      expect(frag.firstChild!.textContent).to.eq(' world')
      expect(text.data).to.eq('hello')
    })
  })

  describe('surroundContents()', () => {
    it('wraps selection in a new parent', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)

      const range = document.createRange()
      range.setStart(text, 6)
      range.setEnd(text, 11)

      const bold = document.createElement('b')
      range.surroundContents(bold)

      expect(div.innerHTML).to.eq('hello <b>world</b>')
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
