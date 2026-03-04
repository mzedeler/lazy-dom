import { expect } from 'chai'

describe('Selection', () => {
  let selection: Selection

  beforeEach(() => {
    selection = window.getSelection()!
    selection.removeAllRanges()
  })

  describe('removeRange()', () => {
    it('removes a range that is in the selection', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      document.body.appendChild(div)

      const range = document.createRange()
      range.setStart(text, 0)
      range.setEnd(text, 5)
      selection.addRange(range)

      expect(selection.rangeCount).to.eq(1)
      selection.removeRange(range)
      expect(selection.rangeCount).to.eq(0)

      document.body.removeChild(div)
    })

    it('throws when range is not in the selection', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      document.body.appendChild(div)

      const range = document.createRange()
      range.setStart(text, 0)
      range.setEnd(text, 5)

      expect(() => selection.removeRange(range)).to.throw()

      document.body.removeChild(div)
    })

    it('resets anchor/focus when last range is removed', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      document.body.appendChild(div)

      const range = document.createRange()
      range.setStart(text, 1)
      range.setEnd(text, 3)
      selection.addRange(range)
      selection.removeRange(range)

      expect(selection.anchorNode).to.be.null
      expect(selection.focusNode).to.be.null

      document.body.removeChild(div)
    })
  })

  describe('empty()', () => {
    it('removes all ranges like removeAllRanges', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      document.body.appendChild(div)

      const range = document.createRange()
      range.setStart(text, 0)
      range.setEnd(text, 5)
      selection.addRange(range)

      selection.empty()
      expect(selection.rangeCount).to.eq(0)
      expect(selection.type).to.eq('None')

      document.body.removeChild(div)
    })
  })

  describe('selectAllChildren()', () => {
    it('selects all children of a node', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      span1.textContent = 'foo'
      const span2 = document.createElement('span')
      span2.textContent = 'bar'
      div.appendChild(span1)
      div.appendChild(span2)
      document.body.appendChild(div)

      selection.selectAllChildren(div)

      expect(selection.rangeCount).to.eq(1)
      const range = selection.getRangeAt(0)
      expect(range.startContainer).to.eq(div)
      expect(range.startOffset).to.eq(0)
      expect(range.endContainer).to.eq(div)
      expect(range.endOffset).to.eq(2)

      document.body.removeChild(div)
    })
  })

  describe('deleteFromDocument()', () => {
    it('deletes range contents from the document', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)
      document.body.appendChild(div)

      const range = document.createRange()
      range.setStart(text, 5)
      range.setEnd(text, 11)
      selection.addRange(range)

      selection.deleteFromDocument()
      expect(text.data).to.eq('hello')

      document.body.removeChild(div)
    })
  })

  describe('containsNode()', () => {
    it('returns true when range fully contains the node', () => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      span.textContent = 'hello'
      div.appendChild(span)
      document.body.appendChild(div)

      const range = document.createRange()
      range.setStart(div, 0)
      range.setEnd(div, 1)
      selection.addRange(range)

      expect(selection.containsNode(span)).to.be.true

      document.body.removeChild(div)
    })

    it('returns false when range does not contain the node', () => {
      const div = document.createElement('div')
      const span1 = document.createElement('span')
      span1.textContent = 'foo'
      const span2 = document.createElement('span')
      span2.textContent = 'bar'
      div.appendChild(span1)
      div.appendChild(span2)
      document.body.appendChild(div)

      const range = document.createRange()
      range.setStart(div, 0)
      range.setEnd(div, 1)
      selection.addRange(range)

      expect(selection.containsNode(span2)).to.be.false

      document.body.removeChild(div)
    })

    it('returns true for partial overlap with allowPartial', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)
      document.body.appendChild(div)

      selection.selectAllChildren(div)

      expect(selection.containsNode(text, true)).to.be.true

      document.body.removeChild(div)
    })

    it('returns false when no selection', () => {
      const div = document.createElement('div')
      expect(selection.containsNode(div)).to.be.false
    })
  })

  describe('modify()', () => {
    before(function () {
      // Selection.modify() is a non-standard WebKit/Blink extension not available in JSDOM
      if (!globalThis.__LAZY_DOM__) this.skip()
    })

    it('moves forward by character', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      document.body.appendChild(div)

      selection.setPosition(text, 2)
      selection.modify('move', 'forward', 'character')

      expect(selection.focusNode).to.eq(text)
      expect(selection.focusOffset).to.eq(3)

      document.body.removeChild(div)
    })

    it('moves backward by character', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      document.body.appendChild(div)

      selection.setPosition(text, 3)
      selection.modify('move', 'backward', 'character')

      expect(selection.focusNode).to.eq(text)
      expect(selection.focusOffset).to.eq(2)

      document.body.removeChild(div)
    })

    it('extends forward by character', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello')
      div.appendChild(text)
      document.body.appendChild(div)

      selection.setPosition(text, 1)
      selection.modify('extend', 'forward', 'character')

      expect(selection.anchorOffset).to.eq(1)
      expect(selection.focusOffset).to.eq(2)
      expect(selection.isCollapsed).to.be.false

      document.body.removeChild(div)
    })

    it('moves forward by word', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)
      document.body.appendChild(div)

      selection.setPosition(text, 0)
      selection.modify('move', 'forward', 'word')

      expect(selection.focusNode).to.eq(text)
      expect(selection.focusOffset).to.eq(5)

      document.body.removeChild(div)
    })

    it('moves backward by word', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)
      document.body.appendChild(div)

      selection.setPosition(text, 11)
      selection.modify('move', 'backward', 'word')

      expect(selection.focusNode).to.eq(text)
      expect(selection.focusOffset).to.eq(6)

      document.body.removeChild(div)
    })

    it('moves to line boundary forward', () => {
      const div = document.createElement('div')
      const text = document.createTextNode('hello world')
      div.appendChild(text)
      document.body.appendChild(div)

      selection.setPosition(text, 3)
      selection.modify('move', 'forward', 'lineboundary')

      expect(selection.focusNode).to.eq(text)
      expect(selection.focusOffset).to.eq(11)

      document.body.removeChild(div)
    })
  })
})
