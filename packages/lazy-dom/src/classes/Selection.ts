import type { Node } from "./Node/Node"
import type { Range } from "./Range"

const DOCUMENT_POSITION_FOLLOWING = 0x04
const DOCUMENT_POSITION_CONTAINED_BY = 0x10

// Lazy import to avoid circular dependency (Selection → Range → Node → ... → Document → Window → Selection)
function createRange(): Range {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Range: RangeClass } = require('./Range') as typeof import('./Range')
  return new RangeClass()
}

export class Selection {
  private _ranges: Range[] = []
  private _anchorNode: Node | null = null
  private _anchorOffset = 0
  private _focusNode: Node | null = null
  private _focusOffset = 0

  get anchorNode(): Node | null { return this._anchorNode }
  get anchorOffset(): number { return this._anchorOffset }
  get focusNode(): Node | null { return this._focusNode }
  get focusOffset(): number { return this._focusOffset }
  get rangeCount(): number { return this._ranges.length }

  get isCollapsed(): boolean {
    return this._anchorNode === this._focusNode && this._anchorOffset === this._focusOffset
  }

  get type(): string {
    if (this._ranges.length === 0) return "None"
    return this.isCollapsed ? "Caret" : "Range"
  }

  addRange(range: Range) {
    this._ranges.push(range)
    if (!this._anchorNode) {
      this._anchorNode = range.startContainer
      this._anchorOffset = range.startOffset
      this._focusNode = range.endContainer
      this._focusOffset = range.endOffset
    }
  }

  removeAllRanges() {
    this._ranges.length = 0
    this._anchorNode = null
    this._anchorOffset = 0
    this._focusNode = null
    this._focusOffset = 0
  }

  getRangeAt(index: number): Range {
    if (index < 0 || index >= this._ranges.length) {
      throw new DOMException("Index out of range", "IndexSizeError")
    }
    return this._ranges[index]
  }

  setPosition(node: Node | null, offset = 0) {
    this.removeAllRanges()
    if (!node) return
    this._anchorNode = node
    this._anchorOffset = offset
    this._focusNode = node
    this._focusOffset = offset
    const range = createRange()
    range.setStart(node, offset)
    range.setEnd(node, offset)
    this._ranges.push(range)
  }

  collapse(node: Node | null, offset = 0) {
    this.setPosition(node, offset)
  }

  extend(node: Node, offset = 0) {
    this._focusNode = node
    this._focusOffset = offset
    if (this._ranges.length > 0) {
      const range = this._ranges[0]
      if (this._anchorNode === node) {
        if (offset >= this._anchorOffset) {
          range.setEnd(node, offset)
        } else {
          range.setStart(node, offset)
        }
      } else if (this._anchorNode) {
        const pos = this._anchorNode.compareDocumentPosition(node)
        if (pos & DOCUMENT_POSITION_FOLLOWING || pos & DOCUMENT_POSITION_CONTAINED_BY) {
          range.setEnd(node, offset)
        } else {
          range.setStart(node, offset)
        }
      }
    }
  }

  setBaseAndExtent(aNode: Node, aOffset: number, fNode: Node, fOffset: number) {
    this.removeAllRanges()
    this._anchorNode = aNode
    this._anchorOffset = aOffset
    this._focusNode = fNode
    this._focusOffset = fOffset
    const range = createRange()
    if (aNode === fNode) {
      range.setStart(aNode, Math.min(aOffset, fOffset))
      range.setEnd(aNode, Math.max(aOffset, fOffset))
    } else {
      const pos = aNode.compareDocumentPosition(fNode)
      if (pos & DOCUMENT_POSITION_FOLLOWING || pos & DOCUMENT_POSITION_CONTAINED_BY) {
        range.setStart(aNode, aOffset)
        range.setEnd(fNode, fOffset)
      } else {
        range.setStart(fNode, fOffset)
        range.setEnd(aNode, aOffset)
      }
    }
    this._ranges.push(range)
  }

  collapseToStart() {
    if (this._ranges.length > 0) this.setPosition(this._ranges[0].startContainer, this._ranges[0].startOffset)
  }

  collapseToEnd() {
    if (this._ranges.length > 0) this.setPosition(this._ranges[0].endContainer, this._ranges[0].endOffset)
  }

  selectAllChildren() {}
  deleteFromDocument() {}
  containsNode(): boolean { return false }

  toString(): string {
    return this._ranges.map(r => r.toString()).join('')
  }
}
