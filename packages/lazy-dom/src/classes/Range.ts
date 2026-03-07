import { Node } from './Node/Node'
import { Element } from './Element'
import { DocumentFragment } from './DocumentFragment'
import { CharacterData } from './CharacterData'
import { DOMException } from './DOMException'
import type { Document } from './Document'
import { parseHTML } from '../utils/parseHTML'

// Global set of live Range objects for boundary point tracking
const liveRanges = new Set<Range>()

/** Clear all tracked live ranges (called by reset between test files). */
export function clearLiveRanges(): void { liveRanges.clear() }

export class Range {
  static readonly START_TO_START = 0
  static readonly START_TO_END = 1
  static readonly END_TO_END = 2
  static readonly END_TO_START = 3

  readonly START_TO_START = 0
  readonly START_TO_END = 1
  readonly END_TO_END = 2
  readonly END_TO_START = 3

  startContainer: Node | null = null
  startOffset = 0
  endContainer: Node | null = null
  endOffset = 0
  collapsed = true
  commonAncestorContainer: Node | null = null

  constructor() {
    liveRanges.add(this)
  }

  /**
   * Called when a child node is removed from a parent.
   * Adjusts boundary points of all live Ranges per the DOM spec:
   * if a Range's start/end container is the parent and offset > child index,
   * decrement the offset.
   */
  static _notifyChildRemoved(parent: Node, childIndex: number) {
    if (liveRanges.size === 0) return
    for (const range of liveRanges) {
      if (range.startContainer === parent && range.startOffset > childIndex) {
        range.startOffset--
      }
      if (range.endContainer === parent && range.endOffset > childIndex) {
        range.endOffset--
      }
    }
  }

  /**
   * Called when a child node is inserted into a parent.
   * Adjusts boundary points: if offset > child index, increment.
   */
  static _notifyChildInserted(parent: Node, childIndex: number) {
    if (liveRanges.size === 0) return
    for (const range of liveRanges) {
      if (range.startContainer === parent && range.startOffset > childIndex) {
        range.startOffset++
      }
      if (range.endContainer === parent && range.endOffset > childIndex) {
        range.endOffset++
      }
    }
  }

  /**
   * Called when a Text node is split via splitText().
   * Per DOM spec: for each live Range whose start/end node is the original
   * text node and offset > split point, move the boundary to the new node
   * with the offset adjusted by subtracting the split point.
   */
  static _notifyTextSplit(originalNode: Node, newNode: Node, offset: number) {
    if (liveRanges.size === 0) return
    for (const range of liveRanges) {
      if (range.startContainer === originalNode && range.startOffset > offset) {
        range.startContainer = newNode
        range.startOffset -= offset
      }
      if (range.endContainer === originalNode && range.endOffset > offset) {
        range.endContainer = newNode
        range.endOffset -= offset
      }
    }
  }

  setStart(node: Node, offset: number) {
    this.startContainer = node
    this.startOffset = offset
    if (!this.endContainer) {
      this.endContainer = node
      this.endOffset = offset
    }
    this._update()
  }

  setEnd(node: Node, offset: number) {
    this.endContainer = node
    this.endOffset = offset
    this._update()
  }

  setStartBefore(node: Node) {
    const parent = node.parentNode
    if (parent instanceof Node) {
      const children = parent.childNodes
      for (let i = 0; i < children.length; i++) {
        if (children[i] === node) {
          this.setStart(parent, i)
          return
        }
      }
    }
  }

  setStartAfter(node: Node) {
    const parent = node.parentNode
    if (parent instanceof Node) {
      const children = parent.childNodes
      for (let i = 0; i < children.length; i++) {
        if (children[i] === node) {
          this.setStart(parent, i + 1)
          return
        }
      }
    }
  }

  setEndBefore(node: Node) {
    const parent = node.parentNode
    if (parent instanceof Node) {
      const children = parent.childNodes
      for (let i = 0; i < children.length; i++) {
        if (children[i] === node) {
          this.setEnd(parent, i)
          return
        }
      }
    }
  }

  setEndAfter(node: Node) {
    const parent = node.parentNode
    if (parent instanceof Node) {
      const children = parent.childNodes
      for (let i = 0; i < children.length; i++) {
        if (children[i] === node) {
          this.setEnd(parent, i + 1)
          return
        }
      }
    }
  }

  selectNode(node: Node) {
    this.setStartBefore(node)
    this.setEndAfter(node)
  }

  selectNodeContents(node: Node) {
    this.startContainer = node
    this.startOffset = 0
    this.endContainer = node
    this.endOffset = node instanceof CharacterData ? node.length : node.childNodes.length
    this._update()
  }

  collapse(toStart = false) {
    if (toStart) {
      this.endContainer = this.startContainer
      this.endOffset = this.startOffset
    } else {
      this.startContainer = this.endContainer
      this.startOffset = this.endOffset
    }
    this.collapsed = true
  }

  cloneRange(): Range {
    const range = new Range()
    range.startContainer = this.startContainer
    range.startOffset = this.startOffset
    range.endContainer = this.endContainer
    range.endOffset = this.endOffset
    range.collapsed = this.collapsed
    range.commonAncestorContainer = this.commonAncestorContainer
    return range
  }

  detach() {}

  getBoundingClientRect() {
    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }
  }

  getClientRects() {
    return []
  }

  createContextualFragment(html: string): DocumentFragment {
    const container = this.startContainer
    const doc = (container
      ? (container as Element).ownerDocument ?? (globalThis as Record<string, unknown>).document
      : (globalThis as Record<string, unknown>).document) as Document
    const fragment = doc.createDocumentFragment()
    const nodes = parseHTML(html, doc)
    for (const node of nodes) {
      fragment.appendChild(node)
    }
    return fragment
  }

  comparePoint(node: Node, offset: number): number {
    if (!this.startContainer || !this.endContainer) {
      throw new DOMException('Range has no boundary points', 'InvalidStateError')
    }

    const startPos = this._compareBoundaryPosition(node, offset, this.startContainer, this.startOffset)
    if (startPos < 0) return -1

    const endPos = this._compareBoundaryPosition(node, offset, this.endContainer, this.endOffset)
    if (endPos > 0) return 1

    return 0
  }

  isPointInRange(node: Node, offset: number): boolean {
    try {
      return this.comparePoint(node, offset) === 0
    } catch {
      return false
    }
  }

  compareBoundaryPoints(how: number, sourceRange: Range): number {
    if (how < 0 || how > 3) {
      throw new DOMException('The comparison method provided is not supported.', 'NotSupportedError', DOMException.NOT_SUPPORTED_ERR)
    }
    if (!this.startContainer || !this.endContainer || !sourceRange.startContainer || !sourceRange.endContainer) {
      throw new DOMException('Range has no boundary points', 'InvalidStateError')
    }

    let thisNode: Node
    let thisOffset: number
    let sourceNode: Node
    let sourceOffset: number

    switch (how) {
      case Range.START_TO_START:
        thisNode = this.startContainer
        thisOffset = this.startOffset
        sourceNode = sourceRange.startContainer
        sourceOffset = sourceRange.startOffset
        break
      case Range.START_TO_END:
        thisNode = this.endContainer
        thisOffset = this.endOffset
        sourceNode = sourceRange.startContainer
        sourceOffset = sourceRange.startOffset
        break
      case Range.END_TO_END:
        thisNode = this.endContainer
        thisOffset = this.endOffset
        sourceNode = sourceRange.endContainer
        sourceOffset = sourceRange.endOffset
        break
      default: // END_TO_START
        thisNode = this.startContainer
        thisOffset = this.startOffset
        sourceNode = sourceRange.endContainer
        sourceOffset = sourceRange.endOffset
        break
    }

    const result = this._compareBoundaryPosition(thisNode, thisOffset, sourceNode, sourceOffset)
    return result < 0 ? -1 : result > 0 ? 1 : 0
  }

  deleteContents(): void {
    if (this.collapsed || !this.startContainer || !this.endContainer) return

    // Same container
    if (this.startContainer === this.endContainer) {
      if (this.startContainer instanceof CharacterData) {
        this.startContainer.deleteData(this.startOffset, this.endOffset - this.startOffset)
      } else {
        for (let i = this.endOffset - 1; i >= this.startOffset; i--) {
          const child = this.startContainer.childNodes[i]
          if (child) this.startContainer.removeChild(child)
        }
      }
      this.collapse(true)
      return
    }

    // Different containers
    const startContainer = this.startContainer
    const startOffset = this.startOffset
    const endContainer = this.endContainer
    const endOffset = this.endOffset
    const commonAncestor = this.commonAncestorContainer!

    // Build paths from each boundary to common ancestor
    const startPath = _pathToAncestor(startContainer, commonAncestor)
    const endPath = _pathToAncestor(endContainer, commonAncestor)

    const startSideChild = startPath.length > 0 ? startPath[startPath.length - 1] : null
    const endSideChild = endPath.length > 0 ? endPath[endPath.length - 1] : null

    // Collect middle nodes (children of commonAncestor between start-side and end-side)
    const middleNodesToRemove: Node[] = []
    if (startSideChild && endSideChild) {
      let sibling = startSideChild.nextSibling
      while (sibling && sibling !== endSideChild) {
        middleNodesToRemove.push(sibling)
        sibling = sibling.nextSibling
      }
    }

    // Collect siblings to remove along start path (after each path node)
    const startSiblingsToRemove: Array<{ parent: Node; nodes: Node[] }> = []
    for (let i = 0; i < startPath.length - 1; i++) {
      const pathNode = startPath[i]
      const siblings: Node[] = []
      let sib = pathNode.nextSibling
      while (sib) {
        siblings.push(sib)
        sib = sib.nextSibling
      }
      if (siblings.length > 0) {
        startSiblingsToRemove.push({ parent: pathNode.parentNode as Node, nodes: siblings })
      }
    }

    // Collect children to remove from element start container
    const startChildrenToRemove: Node[] = []
    if (!(startContainer instanceof CharacterData)) {
      for (let i = startOffset; i < startContainer.childNodes.length; i++) {
        const child = startContainer.childNodes[i]
        if (child) startChildrenToRemove.push(child)
      }
    }

    // Collect siblings to remove along end path (before each path node)
    const endSiblingsToRemove: Array<{ parent: Node; nodes: Node[] }> = []
    for (let i = 0; i < endPath.length - 1; i++) {
      const pathNode = endPath[i]
      const siblings: Node[] = []
      let sib = pathNode.previousSibling
      while (sib) {
        siblings.unshift(sib)
        sib = sib.previousSibling
      }
      if (siblings.length > 0) {
        endSiblingsToRemove.push({ parent: pathNode.parentNode as Node, nodes: siblings })
      }
    }

    // Collect children to remove from element end container
    const endChildrenToRemove: Node[] = []
    if (!(endContainer instanceof CharacterData)) {
      for (let i = 0; i < endOffset; i++) {
        const child = endContainer.childNodes[i]
        if (child) endChildrenToRemove.push(child)
      }
    }

    // Determine collapse point
    let newNode: Node = startContainer
    let newOffset: number = startOffset
    if (!startContainer.contains(endContainer)) {
      let ref: Node = startContainer
      while (ref.parentNode && !(ref.parentNode as Node).contains(endContainer)) {
        ref = ref.parentNode as Node
      }
      if (ref.parentNode) {
        newNode = ref.parentNode as Node
        newOffset = _indexOfChild(ref, newNode) + 1
      }
    }

    // Now perform all removals

    // Truncate start CharacterData
    if (startContainer instanceof CharacterData) {
      startContainer.deleteData(startOffset, startContainer.length - startOffset)
    } else {
      for (const child of startChildrenToRemove) {
        startContainer.removeChild(child)
      }
    }

    // Remove start-side siblings
    for (const { parent, nodes } of startSiblingsToRemove) {
      for (const node of nodes) {
        parent.removeChild(node)
      }
    }

    // Remove middle nodes
    for (const node of middleNodesToRemove) {
      commonAncestor.removeChild(node)
    }

    // Remove end-side siblings
    for (const { parent, nodes } of endSiblingsToRemove) {
      for (const node of nodes) {
        parent.removeChild(node)
      }
    }

    // Truncate end CharacterData
    if (endContainer instanceof CharacterData) {
      endContainer.deleteData(0, endOffset)
    } else {
      for (const child of endChildrenToRemove) {
        endContainer.removeChild(child)
      }
    }

    // Collapse range
    this.setStart(newNode, newOffset)
    this.setEnd(newNode, newOffset)
  }

  cloneContents(): DocumentFragment {
    if (!this.startContainer || !this.endContainer) {
      const doc = (globalThis as Record<string, unknown>).document as Document
      return doc.createDocumentFragment()
    }

    const doc = (this.startContainer instanceof Element
      ? this.startContainer.ownerDocument
      : (this.startContainer as Node).ownerDocument) as Document
    const fragment = doc.createDocumentFragment()

    if (this.collapsed) return fragment

    // Same container
    if (this.startContainer === this.endContainer) {
      if (this.startContainer instanceof CharacterData) {
        const clone = this.startContainer.cloneNode(false)
        ;(clone as unknown as CharacterData).data = this.startContainer.substringData(this.startOffset, this.endOffset - this.startOffset)
        fragment.appendChild(clone)
      } else {
        for (let i = this.startOffset; i < this.endOffset; i++) {
          const child = this.startContainer.childNodes[i]
          if (child) fragment.appendChild(child.cloneNode(true))
        }
      }
      return fragment
    }

    // Different containers - clone partial start, full middle, partial end
    const commonAncestor = this.commonAncestorContainer!
    const startPath = _pathToAncestor(this.startContainer, commonAncestor)
    const endPath = _pathToAncestor(this.endContainer, commonAncestor)
    const startSideChild = startPath.length > 0 ? startPath[startPath.length - 1] : null
    const endSideChild = endPath.length > 0 ? endPath[endPath.length - 1] : null

    // Clone start side
    if (this.startContainer instanceof CharacterData) {
      const clone = this.startContainer.cloneNode(false)
      ;(clone as unknown as CharacterData).data = this.startContainer.substringData(this.startOffset, this.startContainer.length - this.startOffset)
      let current = clone
      for (let i = 0; i < startPath.length - 1; i++) {
        const parentClone = startPath[i + 1].cloneNode(false)
        parentClone.appendChild(current)
        // Clone siblings after the path node
        let sib = startPath[i].nextSibling
        while (sib) {
          parentClone.appendChild(sib.cloneNode(true))
          sib = sib.nextSibling
        }
        current = parentClone
      }
      fragment.appendChild(current)
    } else if (startSideChild) {
      const clone = startSideChild.cloneNode(false)
      _cloneChildrenFrom(this.startContainer, this.startOffset, this.startContainer.childNodes.length, clone)
      fragment.appendChild(clone)
    }

    // Clone middle nodes
    if (startSideChild && endSideChild) {
      let sibling = startSideChild.nextSibling
      while (sibling && sibling !== endSideChild) {
        fragment.appendChild(sibling.cloneNode(true))
        sibling = sibling.nextSibling
      }
    }

    // Clone end side
    if (this.endContainer instanceof CharacterData) {
      const clone = this.endContainer.cloneNode(false)
      ;(clone as unknown as CharacterData).data = this.endContainer.substringData(0, this.endOffset)
      let current = clone
      for (let i = 0; i < endPath.length - 1; i++) {
        const parentClone = endPath[i + 1].cloneNode(false)
        // Clone siblings before the path node
        let sib = endPath[i].previousSibling
        const preSibs: Node[] = []
        while (sib) {
          preSibs.unshift(sib)
          sib = sib.previousSibling
        }
        for (const s of preSibs) parentClone.appendChild(s.cloneNode(true))
        parentClone.appendChild(current)
        current = parentClone
      }
      fragment.appendChild(current)
    } else if (endSideChild) {
      const clone = endSideChild.cloneNode(false)
      _cloneChildrenFrom(this.endContainer, 0, this.endOffset, clone)
      fragment.appendChild(clone)
    }

    return fragment
  }

  extractContents(): DocumentFragment {
    if (!this.startContainer || !this.endContainer) {
      const doc = (globalThis as Record<string, unknown>).document as Document
      return doc.createDocumentFragment()
    }

    const fragment = this.cloneContents()
    this.deleteContents()
    return fragment
  }

  surroundContents(newParent: Node): void {
    if (!this.startContainer || !this.endContainer) return

    // Validate: range must not partially select a non-CharacterData node
    if (this.startContainer !== this.endContainer) {
      const commonAncestor = this.commonAncestorContainer
      if (commonAncestor) {
        const startPath = _pathToAncestor(this.startContainer, commonAncestor)
        const endPath = _pathToAncestor(this.endContainer, commonAncestor)
        // If start is in a non-CharacterData node and offset > 0 (partial)
        if (startPath.length > 0 && !(this.startContainer instanceof CharacterData) && this.startOffset > 0) {
          throw new DOMException('The Range has partially selected a non-Text node.', 'InvalidStateError')
        }
        // If end is in a non-CharacterData node and offset < childNodes.length (partial)
        if (endPath.length > 0 && !(this.endContainer instanceof CharacterData) && this.endOffset < this.endContainer.childNodes.length) {
          throw new DOMException('The Range has partially selected a non-Text node.', 'InvalidStateError')
        }
      }
    }

    const fragment = this.extractContents()

    // Remove all children from newParent
    while (newParent.firstChild) {
      newParent.removeChild(newParent.firstChild)
    }

    this.insertNode(newParent)
    newParent.appendChild(fragment)
    this.selectNode(newParent)
  }

  insertNode(node: Node) {
    if (!this.startContainer) return

    const isText = (n: Node): boolean => n.childNodes.length === 0 && 'data' in n

    if (isText(this.startContainer)) {
      // Text node: split at offset, insert before the new part
      const textNode = this.startContainer as Node & { splitText(o: number): Node }
      const afterNode = textNode.splitText(this.startOffset)
      const parent = textNode.parentNode
      if (parent) {
        parent.insertBefore(node, afterNode)
      }
    } else {
      // Element: insert before child at startOffset
      const children = this.startContainer.childNodes
      const referenceNode = this.startOffset < children.length
        ? children[this.startOffset] as Node
        : null
      this.startContainer.insertBefore(node, referenceNode)
    }
  }

  toString(): string {
    if (!this.startContainer || !this.endContainer) return ''

    const getTextContent = (node: Node): string =>
      (node as unknown as { textContent: string | null }).textContent ?? ''

    const getData = (node: Node): string =>
      (node as unknown as { data: string }).data ?? ''

    const isTextNode = (node: Node): boolean =>
      node.childNodes.length === 0 && 'data' in node

    // Next node in document order (depth-first pre-order)
    const nextInOrder = (node: Node): Node | null => {
      if (node.childNodes.length > 0) return node.childNodes[0] as Node
      let cur: Node | null = node
      while (cur) {
        if (cur.nextSibling) return cur.nextSibling as Node
        cur = cur.parentNode as Node | null
      }
      return null
    }

    // Next node after a subtree (skip descendants)
    const nextAfter = (node: Node): Node | null => {
      let cur: Node | null = node
      while (cur) {
        if (cur.nextSibling) return cur.nextSibling as Node
        cur = cur.parentNode as Node | null
      }
      return null
    }

    // Same container
    if (this.startContainer === this.endContainer) {
      if (isTextNode(this.startContainer)) {
        return getData(this.startContainer).slice(this.startOffset, this.endOffset)
      }
      let result = ''
      const children = this.startContainer.childNodes
      for (let i = this.startOffset; i < this.endOffset && i < children.length; i++) {
        result += getTextContent(children[i] as Node)
      }
      return result
    }

    // Cross-container: walk in document order per the DOM spec
    let result = ''

    // Step 3: If start node is a Text node, take partial text
    if (isTextNode(this.startContainer)) {
      result += getData(this.startContainer).slice(this.startOffset)
    }

    // Step 4: Determine walk start — first node after the start boundary
    let walker: Node | null
    if (isTextNode(this.startContainer)) {
      walker = nextInOrder(this.startContainer)
    } else {
      const children = this.startContainer.childNodes
      walker = this.startOffset < children.length
        ? children[this.startOffset] as Node
        : nextAfter(this.startContainer)
    }

    // Collect all fully contained text nodes between start and end
    while (walker && walker !== this.endContainer) {
      if (isTextNode(walker)) {
        result += getData(walker)
      }
      walker = nextInOrder(walker)
    }

    // Step 5: If end node is a Text node, take partial text
    if (isTextNode(this.endContainer)) {
      result += getData(this.endContainer).slice(0, this.endOffset)
    } else if (walker === this.endContainer) {
      // Element end container: collect text from children[0..endOffset)
      const children = this.endContainer.childNodes
      for (let i = 0; i < this.endOffset && i < children.length; i++) {
        result += getTextContent(children[i] as Node)
      }
    }

    return result
  }

  /**
   * Compare position of (nodeA, offsetA) relative to (nodeB, offsetB).
   * Returns negative if A is before B, 0 if equal, positive if A is after B.
   */
  private _compareBoundaryPosition(
    nodeA: Node, offsetA: number,
    nodeB: Node, offsetB: number,
  ): number {
    if (nodeA === nodeB) return offsetA - offsetB

    const position = nodeA.compareDocumentPosition(nodeB)
    // nodeB contains nodeA: nodeA is inside nodeB
    if (position & Node.DOCUMENT_POSITION_CONTAINS) {
      // Walk from nodeA up to find the child of nodeB
      let child: Node = nodeA
      let parent = child.parentNode
      while (parent && parent !== nodeB) {
        child = parent as Node
        parent = child.parentNode
      }
      // Find child's index among nodeB's children
      const children = nodeB.childNodes
      for (let i = 0; i < children.length; i++) {
        if (children[i] === child) {
          return i < offsetB ? -1 : 1
        }
      }
    }
    // nodeB is contained by nodeA: nodeB is inside nodeA
    if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      // Walk from nodeB up to find the child of nodeA
      let child: Node = nodeB
      let parent = child.parentNode
      while (parent && parent !== nodeA) {
        child = parent as Node
        parent = child.parentNode
      }
      const children = nodeA.childNodes
      for (let i = 0; i < children.length; i++) {
        if (children[i] === child) {
          return offsetA <= i ? -1 : 1
        }
      }
    }
    // nodeB follows nodeA — nodeA is before nodeB
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1
    }
    // nodeB precedes nodeA — nodeA is after nodeB
    return 1
  }

  private _update() {
    this.collapsed = this.startContainer === this.endContainer && this.startOffset === this.endOffset
    this.commonAncestorContainer = this._computeCommonAncestor()
  }

  private _computeCommonAncestor(): Node | null {
    if (!this.startContainer || !this.endContainer) return null
    if (this.startContainer === this.endContainer) return this.startContainer

    // Walk up from startContainer to collect all ancestors
    const ancestors = new Set<Node>()
    let node: Node | null = this.startContainer
    while (node) {
      ancestors.add(node)
      node = node.parent
    }

    // Walk up from endContainer to find the first common ancestor
    node = this.endContainer
    while (node) {
      if (ancestors.has(node)) return node
      node = node.parent
    }

    return this.startContainer
  }
}

function _pathToAncestor(node: Node, ancestor: Node): Node[] {
  const path: Node[] = []
  let current: Node = node
  while (current !== ancestor) {
    path.push(current)
    const parent = current.parent
    if (!parent) break
    current = parent
  }
  return path
}

function _indexOfChild(child: Node, parent: Node): number {
  const children = parent.childNodes
  for (let i = 0; i < children.length; i++) {
    if (children[i] === child) return i
  }
  return -1
}

function _cloneChildrenFrom(source: Node, startIdx: number, endIdx: number, target: Node): void {
  for (let i = startIdx; i < endIdx; i++) {
    const child = source.childNodes[i]
    if (child) target.appendChild(child.cloneNode(true))
  }
}
