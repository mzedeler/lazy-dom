import { Node } from './Node/Node'
import { Element } from './Element'
import { DocumentFragment } from './DocumentFragment'

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

  toString() {
    return ''
  }

  private _update() {
    this.collapsed = this.startContainer === this.endContainer && this.startOffset === this.endOffset
    this.commonAncestorContainer = this.startContainer
  }
}
