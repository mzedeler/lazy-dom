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

  removeRange(range: Range) {
    const idx = this._ranges.indexOf(range)
    if (idx === -1) {
      throw new DOMException("The given range is not in the selection.", "NotFoundError")
    }
    this._ranges.splice(idx, 1)
    if (this._ranges.length === 0) {
      this._anchorNode = null
      this._anchorOffset = 0
      this._focusNode = null
      this._focusOffset = 0
    }
  }

  removeAllRanges() {
    this._ranges.length = 0
    this._anchorNode = null
    this._anchorOffset = 0
    this._focusNode = null
    this._focusOffset = 0
  }

  empty() {
    this.removeAllRanges()
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

  selectAllChildren(node: Node) {
    this.removeAllRanges()
    const range = createRange()
    range.selectNodeContents(node)
    this.addRange(range)
  }

  deleteFromDocument() {
    for (const range of this._ranges) {
      range.deleteContents()
    }
  }

  containsNode(node: Node, allowPartial = false): boolean {
    if (this._ranges.length === 0) return false

    const nodeRange = createRange()
    nodeRange.selectNode(node)

    for (const range of this._ranges) {
      if (!range.startContainer || !range.endContainer) continue

      // Check if range fully contains nodeRange
      const startCompare = range.compareBoundaryPoints(0 /* START_TO_START */, nodeRange)
      const endCompare = range.compareBoundaryPoints(2 /* END_TO_END */, nodeRange)

      if (startCompare <= 0 && endCompare >= 0) {
        return true
      }

      if (allowPartial) {
        // Check for overlap: range start before nodeRange end AND range end after nodeRange start
        const startToEnd = range.compareBoundaryPoints(3 /* END_TO_START */, nodeRange)
        const endToStart = range.compareBoundaryPoints(1 /* START_TO_END */, nodeRange)
        if (startToEnd <= 0 && endToStart >= 0) {
          return true
        }
      }
    }

    return false
  }

  modify(alter: string, direction: string, granularity: string) {
    if (this._ranges.length === 0) return

    const isForward = direction === 'forward' || direction === 'right'
    const focusNode = this._focusNode
    const focusOffset = this._focusOffset
    if (!focusNode) return

    let newNode: Node = focusNode
    let newOffset: number = focusOffset

    if (granularity === 'character') {
      const result = _moveByCharacter(focusNode, focusOffset, isForward)
      newNode = result.node
      newOffset = result.offset
    } else if (granularity === 'word') {
      const result = _moveByWord(focusNode, focusOffset, isForward)
      newNode = result.node
      newOffset = result.offset
    } else if (granularity === 'lineboundary' || granularity === 'line') {
      const result = _moveToLineBoundary(focusNode, focusOffset, isForward)
      newNode = result.node
      newOffset = result.offset
    }

    if (alter === 'move') {
      this.setPosition(newNode, newOffset)
    } else if (alter === 'extend') {
      this.extend(newNode, newOffset)
    }
  }

  toString(): string {
    return this._ranges.map(r => r.toString()).join('')
  }
}

function _getNodeLength(node: Node): number {
  if ('data' in node && typeof (node as unknown as { data: string }).data === 'string') {
    return (node as unknown as { data: string }).data.length
  }
  return node.childNodes.length
}

function _nextTextNode(node: Node): { node: Node; offset: number } | null {
  let current: Node | null = node
  // Try next sibling's descendants first
  if (current.nextSibling) {
    current = current.nextSibling
    while (current.firstChild) current = current.firstChild
    if ('data' in current) return { node: current, offset: 0 }
    return _nextTextNode(current)
  }
  // Walk up and look for next sibling
  current = current.parent
  while (current) {
    if (current.nextSibling) {
      current = current.nextSibling
      while (current.firstChild) current = current.firstChild
      if ('data' in current) return { node: current, offset: 0 }
      return _nextTextNode(current)
    }
    current = current.parent
  }
  return null
}

function _prevTextNode(node: Node): { node: Node; offset: number } | null {
  let current: Node | null = node
  // Try previous sibling's last descendants
  if (current.previousSibling) {
    current = current.previousSibling
    while (current.lastChild) current = current.lastChild
    if ('data' in current) return { node: current, offset: _getNodeLength(current) }
    return _prevTextNode(current)
  }
  // Walk up and look for previous sibling
  current = current.parent
  while (current) {
    if (current.previousSibling) {
      current = current.previousSibling
      while (current.lastChild) current = current.lastChild
      if ('data' in current) return { node: current, offset: _getNodeLength(current) }
      return _prevTextNode(current)
    }
    current = current.parent
  }
  return null
}

function _moveByCharacter(node: Node, offset: number, forward: boolean): { node: Node; offset: number } {
  const len = _getNodeLength(node)
  if (forward) {
    if (offset < len) return { node, offset: offset + 1 }
    const next = _nextTextNode(node)
    if (next) return { node: next.node, offset: Math.min(1, _getNodeLength(next.node)) }
  } else {
    if (offset > 0) return { node, offset: offset - 1 }
    const prev = _prevTextNode(node)
    if (prev) return { node: prev.node, offset: Math.max(0, prev.offset - 1) }
  }
  return { node, offset }
}

function _moveByWord(node: Node, offset: number, forward: boolean): { node: Node; offset: number } {
  if (!('data' in node)) return _moveByCharacter(node, offset, forward)
  const data = (node as unknown as { data: string }).data
  if (forward) {
    const after = data.substring(offset)
    const match = /^\s*\S+/.exec(after)
    if (match) return { node, offset: offset + match[0].length }
    // Move to next text node
    const next = _nextTextNode(node)
    if (next) return _moveByWord(next.node, 0, true)
  } else {
    const before = data.substring(0, offset)
    const match = /\S+\s*$/.exec(before)
    if (match) return { node, offset: offset - match[0].length }
    // Move to previous text node
    const prev = _prevTextNode(node)
    if (prev) return _moveByWord(prev.node, _getNodeLength(prev.node), false)
  }
  return { node, offset }
}

function _moveToLineBoundary(node: Node, _offset: number, forward: boolean): { node: Node; offset: number } {
  // Without a layout engine, approximate as start/end of text content
  if (forward) {
    return { node, offset: _getNodeLength(node) }
  }
  return { node, offset: 0 }
}
