import { DocumentFragment } from "./DocumentFragment"
import { Element } from "./Element"
import { Text } from "./Text"
import { Comment } from "./Comment"
import { Node } from "./Node/Node"
import { parseHTML } from "../utils/parseHTML"
import * as nodeOps from "../wasm/nodeOps"

export class ShadowRoot extends DocumentFragment {
  private _host: Element
  private _mode: ShadowRootMode
  adoptedStyleSheets: CSSStyleSheet[] = []

  constructor(host: Element, init: ShadowRootInit) {
    super()
    this._host = host
    this._mode = init.mode
    this.nodeStore.ownerDocument = () => host.ownerDocument
  }

  get host(): Element {
    return this._host
  }

  get mode(): ShadowRootMode {
    return this._mode
  }

  private _serializeChildren(): string {
    return this.nodeStore.getChildNodesArray()
      .map((node: Node): string => {
        if (node instanceof Element) return node._serializeOuterHTML()
        if (node instanceof Text) return node.data
        if (node instanceof Comment) return `<!--${node.data}-->`
        return ''
      })
      .join('')
  }

  get innerHTML(): string {
    return this._serializeChildren()
  }

  set innerHTML(html: string) {
    // Remove all existing children
    const childIds = nodeOps.getChildIds(this.wasmId)
    const ownerDocument = this.nodeStore.ownerDocument()
    for (const childId of childIds) {
      nodeOps.setParentId(childId, 0)
    }
    nodeOps.clearChildren(this.wasmId)
    this._children = undefined

    // Parse and append new children
    const str = String(html)
    if (str.length) {
      const nodes = parseHTML(str, ownerDocument)
      for (const node of nodes) {
        nodeOps.setParentId(node.wasmId, this.wasmId)
        nodeOps.appendChild(this.wasmId, node.wasmId)
        ;(this._children ??= new Set()).add(node)
      }
    }
  }

  querySelector(selectors: string): Element | null {
    // Delegate to host's implementation via Element prototype
    return Element.prototype.querySelector.call(this, selectors)
  }

  querySelectorAll(query: string): Element[] {
    return Element.prototype.querySelectorAll.call(this, query)
  }
}

type ShadowRootMode = 'open' | 'closed'

interface ShadowRootInit {
  mode: ShadowRootMode
}

interface CSSStyleSheet {
  replaceSync?(text: string): void
}
