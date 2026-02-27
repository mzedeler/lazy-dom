import { NodeTypes } from "../../types/NodeTypes"

import { Document } from "../Document"
import { Element } from "../Element"
import { NodeStore } from "./NodeStore"
import { ChildNodeList } from "./ChildNodeList"
import * as nodeOps from "../../wasm/nodeOps"
import * as NodeRegistry from "../../wasm/NodeRegistry"

export abstract class Node<NV = null> {
  wasmId: number
  nodeStore: NodeStore<NV>
  readonly _childNodes: ChildNodeList<NV>

  readonly ELEMENT_NODE = NodeTypes.ELEMENT_NODE
  readonly TEXT_NODE = NodeTypes.TEXT_NODE
  readonly COMMENT_NODE = NodeTypes.COMMENT_NODE
  readonly DOCUMENT_NODE = NodeTypes.DOCUMENT_NODE
  readonly DOCUMENT_FRAGMENT_NODE = NodeTypes.DOCUMENT_FRAGMENT_NODE

  constructor(nodeType: NodeTypes) {
    this.wasmId = nodeOps.createNode(nodeType)
    NodeRegistry.register(this.wasmId, this)
    this.nodeStore = new NodeStore<NV>(this.wasmId)
    this._childNodes = new ChildNodeList<NV>(this.nodeStore)
  }

  dump(): string {
    return this.nodeType + ':' + this.wasmId + ((this instanceof Element) ? ':' + this.tagName : '')
  }

  get childNodes() {
    return this._childNodes
  }

  get nodeType(): NodeTypes {
    return nodeOps.getNodeType(this.wasmId)
  }

  get ownerDocument(): Document {
    return this.nodeStore.ownerDocument()
  }

  get parent(): Node | undefined {
    const parentId = nodeOps.getParentId(this.wasmId)
    if (parentId === 0) return undefined
    return NodeRegistry.getNode(parentId)
  }

  get parentNode(): Node | undefined {
    return this.parent
  }

  get parentElement(): Element | null {
    const parent = this.parent
    return parent instanceof Element ? parent : null
  }

  get isConnected(): boolean {
    return this.parentNode ? this.parentNode.isConnected : false
  }

  get nodeValue(): NV {
    return this.nodeStore.nodeValue()
  }

  set nodeValue(nodeValue: NV) {
    this.nodeStore.nodeValue = () => nodeValue
  }

  removeChild(node: Node): Node {
    nodeOps.setParentId(node.wasmId, 0)
    nodeOps.removeChild(this.wasmId, node.wasmId)
    this.ownerDocument.documentStore.disconnect(node)

    return node
  }

  insertBefore(newNode: Node, referenceNode: Node | null): Node {
    nodeOps.setParentId(newNode.wasmId, this.wasmId)
    nodeOps.insertBefore(this.wasmId, newNode.wasmId, referenceNode ? referenceNode.wasmId : 0)
    this.ownerDocument.documentStore.connect(newNode)

    return newNode
  }

  appendChild(node: Node) {
    nodeOps.setParentId(node.wasmId, this.wasmId)
    nodeOps.appendChild(this.wasmId, node.wasmId)
    this.ownerDocument.documentStore.connect(node)

    return node
  }

  contains(other: Node | null): boolean {
    if (!other) return false
    let current: Node | undefined = other
    while (current) {
      if (current === (this as Node)) return true
      current = current.parent
    }
    return false
  }

  // TODO: Document doesn't extend Node, so body/head have no parent link to
  // the document. This special-cases the check instead of walking the parent
  // chain naturally. Consider making Document a Node so this isn't needed.
  getRootNode(): Node | Document {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Node = this
    while (current.parent) {
      current = current.parent
    }
    const doc = current.ownerDocument
    if (doc.body === current || doc.head === current) {
      return doc
    }
    return current
  }
}
