import { CssNode, CssElement, isCssNode, isCssElement } from "../types/CssSelectTypes"
import { NodeTypes } from "../types/NodeTypes"

type Predicate<T> = (value: T) => boolean

export class CssSelectAdapter {
  isTag(node: CssNode): node is CssElement {
    return isCssElement(node)
  }

  getChildren(node: CssNode): CssNode[] {
    return Array.from(node.childNodes)
  }

  getParent(node: CssElement): CssNode | null {
    const parent = node.parentNode
    return isCssNode(parent) ? parent : null
  }

  private getNodeParent(node: CssNode): CssNode | null {
    if ('parentNode' in node) {
      const parent = node.parentNode
      return isCssNode(parent) ? parent : null
    }
    return null
  }

  removeSubsets(inputNodes: CssNode[]): CssNode[] {
    const nodes: Array<CssNode | null> = [...inputNodes]
    let idx = nodes.length

    while (--idx > -1) {
      const node = nodes[idx]
      nodes[idx] = null
      let replace = true
      let ancestor = node

      while (ancestor) {
        if (nodes.indexOf(ancestor) > -1) {
          replace = false
          nodes.splice(idx, 1)
          break
        }
        const parent = this.getNodeParent(ancestor)
        if (!parent) break
        ancestor = parent
      }

      if (replace) {
        nodes[idx] = node
      }
    }

    return nodes.filter((n): n is CssNode => n !== null)
  }

  existsOne(test: Predicate<CssElement>, elems: CssNode[]): boolean {
    for (const node of elems) {
      if (this.isTag(node) && test(node)) {
        return true
      }
    }
    return false
  }

  getSiblings(node: CssNode): CssNode[] {
    const parent = this.getNodeParent(node)
    return parent ? this.getChildren(parent) : [node]
  }

  getAttributeValue(elem: CssElement, name: string): string | undefined {
    return elem.getAttribute(name) ?? undefined
  }

  hasAttrib(elem: CssElement, name: string): boolean {
    return elem.hasAttribute(name)
  }

  getName(elem: CssElement): string {
    return elem.tagName.toLocaleLowerCase()
  }

  findOne(test: Predicate<CssElement>, elems: CssNode[]): CssElement | null {
    for (const node of elems) {
      if (this.isTag(node)) {
        if (test(node)) return node
        const children = this.getChildren(node)
        if (children.length > 0) {
          const result = this.findOne(test, children)
          if (result) return result
        }
      }
    }
    return null
  }

  findAll(test: Predicate<CssElement>, nodes: CssNode[]): CssElement[] {
    let result: CssElement[] = []
    for (const node of nodes) {
      if (!this.isTag(node)) continue
      if (test(node)) result.push(node)
      const children = this.getChildren(node)
      if (children.length) {
        result = result.concat(this.findAll(test, children))
      }
    }
    return result
  }

  getText(node: CssNode): string {
    if (this.isTag(node)) {
      return this.getChildren(node).map(child => this.getText(child)).join('')
    }
    if (node.nodeType === NodeTypes.TEXT_NODE) {
      return node.nodeValue ?? ''
    }
    return ''
  }
}
