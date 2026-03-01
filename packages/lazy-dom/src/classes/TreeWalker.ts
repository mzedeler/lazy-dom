import { Node } from "./Node/Node"

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
      current = current.parentNode
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
