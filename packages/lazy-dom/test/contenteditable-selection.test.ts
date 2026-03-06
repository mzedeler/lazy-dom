import { expect } from 'chai'

describe('contenteditable selection', () => {
  let div: HTMLElement
  let p: HTMLElement
  let a: HTMLElement
  let span: HTMLElement
  let textNode: Text

  beforeEach(() => {
    div = document.createElement('div')
    div.setAttribute('contenteditable', 'true')

    p = document.createElement('p')
    a = document.createElement('a')
    a.setAttribute('href', 'google.com')
    span = document.createElement('span')
    span.setAttribute('data-lexical-text', 'true')
    textNode = document.createTextNode('relative link')

    span.appendChild(textNode)
    a.appendChild(span)
    p.appendChild(a)
    div.appendChild(p)
    document.body.appendChild(div)
  })

  afterEach(() => {
    document.body.removeChild(div)
    window.getSelection()!.removeAllRanges()
  })

  describe('focus and initial selection state', () => {
    it('returns a selection after focus', () => {
      div.focus()
      const selection = document.getSelection()!
      expect(selection).to.not.be.null
      expect(selection.anchorNode).to.satisfy((n: Node | null) => n === null || n instanceof Node)
      expect(selection.focusNode).to.satisfy((n: Node | null) => n === null || n instanceof Node)
      expect(selection.rangeCount).to.be.a('number')
    })
  })

  describe('selection.collapse()', () => {
    it('collapses the selection to the end of a text node', () => {
      const selection = document.getSelection()!
      selection.collapse(textNode, 13)

      expect(selection.anchorNode).to.equal(textNode)
      expect(selection.anchorOffset).to.equal(13)
      expect(selection.focusNode).to.equal(textNode)
      expect(selection.focusOffset).to.equal(13)
      expect(selection.isCollapsed).to.be.true
      expect(selection.rangeCount).to.equal(1)
    })

    it('provides a range matching the collapsed position via getRangeAt', () => {
      const selection = document.getSelection()!
      selection.collapse(textNode, 13)

      const range = selection.getRangeAt(0)
      expect(range.startContainer).to.equal(textNode)
      expect(range.startOffset).to.equal(13)
      expect(range.endContainer).to.equal(textNode)
      expect(range.endOffset).to.equal(13)
      expect(range.collapsed).to.be.true
    })
  })

  describe('range mutations and selection reflection', () => {
    it('reflects range changes in the selection when range is modified', () => {
      const selection = document.getSelection()!
      selection.collapse(textNode, 13)

      const range = selection.getRangeAt(0)

      // Modify the range to point at the span element instead
      range.setStart(span, 0)
      range.setEnd(span, 1)

      // The range itself should reflect the change
      expect(range.startContainer).to.equal(span)
      expect(range.startOffset).to.equal(0)
      expect(range.endContainer).to.equal(span)
      expect(range.endOffset).to.equal(1)

      // Selection derives anchor/focus from the range, so it tracks mutations
      expect(selection.anchorNode).to.equal(span)
      expect(selection.focusNode).to.equal(span)
    })
  })

  describe('selection.setBaseAndExtent()', () => {
    it('sets anchor and focus to the same collapsed position', () => {
      const selection = document.getSelection()!
      selection.setBaseAndExtent(textNode, 13, textNode, 13)

      expect(selection.anchorNode).to.equal(textNode)
      expect(selection.anchorOffset).to.equal(13)
      expect(selection.focusNode).to.equal(textNode)
      expect(selection.focusOffset).to.equal(13)
      expect(selection.isCollapsed).to.be.true
      expect(selection.rangeCount).to.equal(1)
    })

    it('sets a non-collapsed selection range', () => {
      const selection = document.getSelection()!
      selection.setBaseAndExtent(textNode, 0, textNode, 8)

      expect(selection.anchorNode).to.equal(textNode)
      expect(selection.anchorOffset).to.equal(0)
      expect(selection.focusNode).to.equal(textNode)
      expect(selection.focusOffset).to.equal(8)
      expect(selection.isCollapsed).to.be.false
      expect(selection.rangeCount).to.equal(1)

      const range = selection.getRangeAt(0)
      expect(range.startContainer).to.equal(textNode)
      expect(range.startOffset).to.equal(0)
      expect(range.endContainer).to.equal(textNode)
      expect(range.endOffset).to.equal(8)
    })
  })
})
