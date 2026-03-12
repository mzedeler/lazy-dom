import type { Node } from "./Node/Node"
import type { Range } from "./Range"
import { DOMException } from "./DOMException"

const DOCUMENT_POSITION_FOLLOWING = 0x04
const DOCUMENT_POSITION_CONTAINED_BY = 0x10

const DIRECTION_FORWARDS = 1
const DIRECTION_BACKWARDS = -1
const DIRECTION_DIRECTIONLESS = 0

// Lazy import to avoid circular dependency (Selection → Range → Node → ... → Document → Window → Selection)
function createRange(): Range {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Range: RangeClass } = require('./Range') as typeof import('./Range')
  return new RangeClass()
}

export class Selection {
  private _range: Range | null = null
  private _direction = DIRECTION_DIRECTIONLESS

  get anchorNode(): Node | null {
    if (!this._range) return null
    return this._direction === DIRECTION_BACKWARDS
      ? this._range.endContainer
      : this._range.startContainer
  }

  get anchorOffset(): number {
    if (!this._range) return 0
    return this._direction === DIRECTION_BACKWARDS
      ? this._range.endOffset
      : this._range.startOffset
  }

  get focusNode(): Node | null {
    if (!this._range) return null
    return this._direction === DIRECTION_BACKWARDS
      ? this._range.startContainer
      : this._range.endContainer
  }

  get focusOffset(): number {
    if (!this._range) return 0
    return this._direction === DIRECTION_BACKWARDS
      ? this._range.startOffset
      : this._range.endOffset
  }

  get rangeCount(): number {
    return this._range ? 1 : 0
  }

  get isCollapsed(): boolean {
    if (!this._range) return true
    return this._range.collapsed
  }

  get type(): string {
    if (!this._range) return "None"
    return this._range.collapsed ? "Caret" : "Range"
  }

  /**
   * Associates a range with this selection.
   * Modeled after JSDOM's _associateRange pattern.
   */
  private _associateRange(newRange: Range | null, direction?: number) {
    this._range = newRange
    this._direction = direction ?? (newRange === null ? DIRECTION_DIRECTIONLESS : DIRECTION_FORWARDS)
  }

  addRange(range: Range) {
    if (this._range) return // Only allow one range, matching JSDOM behavior
    this._associateRange(range)
  }

  removeRange(range: Range) {
    if (this._range !== range) {
      throw new DOMException("The given range is not in the selection.", "NotFoundError")
    }
    this._associateRange(null)
  }

  removeAllRanges() {
    this._associateRange(null)
  }

  empty() {
    this.removeAllRanges()
  }

  getRangeAt(index: number): Range {
    if (index !== 0 || !this._range) {
      throw new DOMException("Index out of range", "IndexSizeError")
    }
    return this._range
  }

  setPosition(node: Node | null, offset = 0) {
    if (!node) {
      this._associateRange(null)
      return
    }
    const range = createRange()
    range.setStart(node, offset)
    range.setEnd(node, offset)
    this._associateRange(range)
  }

  collapse(node: Node | null, offset = 0) {
    this.setPosition(node, offset)
  }

  extend(node: Node, offset = 0) {
    if (!this._range) return
    const anchor = this.anchorNode
    const anchorOff = this.anchorOffset
    if (!anchor) return

    const range = createRange()
    let newDirection: number

    if (anchor === node) {
      if (offset >= anchorOff) {
        range.setStart(anchor, anchorOff)
        range.setEnd(node, offset)
        newDirection = DIRECTION_FORWARDS
      } else {
        range.setStart(node, offset)
        range.setEnd(anchor, anchorOff)
        newDirection = DIRECTION_BACKWARDS
      }
    } else {
      const pos = anchor.compareDocumentPosition(node)
      if (pos & DOCUMENT_POSITION_FOLLOWING || pos & DOCUMENT_POSITION_CONTAINED_BY) {
        range.setStart(anchor, anchorOff)
        range.setEnd(node, offset)
        newDirection = DIRECTION_FORWARDS
      } else {
        range.setStart(node, offset)
        range.setEnd(anchor, anchorOff)
        newDirection = DIRECTION_BACKWARDS
      }
    }
    this._associateRange(range, newDirection)
  }

  setBaseAndExtent(aNode: Node, aOffset: number, fNode: Node, fOffset: number) {
    const range = createRange()
    let direction: number
    if (aNode === fNode) {
      range.setStart(aNode, Math.min(aOffset, fOffset))
      range.setEnd(aNode, Math.max(aOffset, fOffset))
      direction = aOffset <= fOffset ? DIRECTION_FORWARDS : DIRECTION_BACKWARDS
    } else {
      const pos = aNode.compareDocumentPosition(fNode)
      if (pos & DOCUMENT_POSITION_FOLLOWING || pos & DOCUMENT_POSITION_CONTAINED_BY) {
        range.setStart(aNode, aOffset)
        range.setEnd(fNode, fOffset)
        direction = DIRECTION_FORWARDS
      } else {
        range.setStart(fNode, fOffset)
        range.setEnd(aNode, aOffset)
        direction = DIRECTION_BACKWARDS
      }
    }
    this._associateRange(range, direction)
  }

  collapseToStart() {
    if (this._range) this.setPosition(this._range.startContainer, this._range.startOffset)
  }

  collapseToEnd() {
    if (this._range) this.setPosition(this._range.endContainer, this._range.endOffset)
  }

  selectAllChildren(node: Node) {
    this.removeAllRanges()
    const range = createRange()
    range.selectNodeContents(node)
    this.addRange(range)
  }

  deleteFromDocument() {
    if (this._range) {
      this._range.deleteContents()
    }
  }

  containsNode(node: Node, allowPartial = false): boolean {
    if (!this._range) return false

    const nodeRange = createRange()
    nodeRange.selectNode(node)

    const range = this._range
    if (!range.startContainer || !range.endContainer) return false

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

    return false
  }

  modify(alter: string, direction: string, granularity: string) {
    if (!this._range) return

    const isForward = direction === 'forward' || direction === 'right'
    const focusNode = this.focusNode
    const focusOffset = this.focusOffset
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
    return this._range ? this._range.toString() : ''
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
