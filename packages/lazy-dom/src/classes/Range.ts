import { Node } from './Node/Node'
import { Element } from './Element'
import { DocumentFragment } from './DocumentFragment'
import { DOMException } from './DOMException'

// Use late-binding to avoid circular dependency with Document
type DocumentLike = { createDocumentFragment(): DocumentFragment; createTextNode(data: string): { nodeStore: { ownerDocument: () => unknown } } & Node }

export class Range {
  startContainer: Node | null = null
  startOffset = 0
  endContainer: Node | null = null
  endOffset = 0
  collapsed = true
  commonAncestorContainer: Node | null = null

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
    this.endOffset = node.childNodes.length
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
    const doc: DocumentLike = container
      ? (container as Element).ownerDocument ?? (globalThis as Record<string, unknown>).document as DocumentLike
      : (globalThis as Record<string, unknown>).document as DocumentLike
    const fragment = doc.createDocumentFragment()
    const textNode = doc.createTextNode(html)
    fragment.appendChild(textNode as Node)
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
    this.commonAncestorContainer = this.startContainer
  }
}
