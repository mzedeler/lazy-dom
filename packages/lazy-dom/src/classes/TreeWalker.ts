import { Node } from "./Node/Node"
import type { Document } from "./Document"

export class TreeWalker {
  root: Node
  whatToShow: number
  filter: { acceptNode: (node: Node) => number } | null
  currentNode: Node

  constructor(root: Node, whatToShow: number, filter: { acceptNode: (node: Node) => number } | null) {
    this.root = root
    this.whatToShow = whatToShow
    this.filter = filter
    this.currentNode = root
  }

  private acceptNode(node: Node): boolean {
    const nodeType = node.nodeType
    const flag = 1 << (nodeType - 1)
    if ((this.whatToShow & flag) === 0) return false
    if (this.filter) {
      return this.filter.acceptNode(node) === 1 // FILTER_ACCEPT
    }
    return true
  }

  private getNextNode(node: Node): Node | null {
    // Depth-first: try first child
    const children = node.childNodes
    const firstChild = children[0]
    if (firstChild) {
      return firstChild
    }
    // Then try next sibling, or ancestor's next sibling
    let current: Node | null = node
    while (current && current !== this.root) {
      const sibling = current.nextSibling
      if (sibling) return sibling
      const parent: Node | Document | null = current.parentNode
      current = parent instanceof Node ? parent : null
    }
    return null
  }

  nextNode(): Node | null {
    let node: Node | null = this.currentNode
    while (true) {
      node = this.getNextNode(node)
      if (!node) return null
      if (this.acceptNode(node)) {
        this.currentNode = node
        return node
      }
    }
  }

  private getPreviousNode(node: Node): Node | null {
    // Try previous sibling's deepest last descendant
    const sibling = node.previousSibling
    if (sibling) {
      // Find the deepest last child of the sibling
      let current: Node = sibling
      while (true) {
        const children = current.childNodes
        const lastChild = children.length > 0 ? children[children.length - 1] : null
        if (!lastChild) break
        current = lastChild
      }
      return current
    }
    // Go to parent (unless we've reached root)
    const parent: Node | null = node.parentNode instanceof Node ? node.parentNode : null
    if (parent && parent !== this.root) return parent
    if (parent === this.root) return parent
    return null
  }

  previousNode(): Node | null {
    let node: Node | null = this.currentNode
    while (true) {
      node = this.getPreviousNode(node)
      if (!node || node === this.root) return null
      if (this.acceptNode(node)) {
        this.currentNode = node
        return node
      }
    }
  }

  firstChild(): Node | null {
    const children = this.currentNode.childNodes
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (!child) continue
      if (this.acceptNode(child)) {
        this.currentNode = child
        return child
      }
    }
    return null
  }
}
