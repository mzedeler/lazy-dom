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

  appendChild(node: Node) {
    nodeOps.setParentId(node.wasmId, this.wasmId)
    nodeOps.appendChild(this.wasmId, node.wasmId)
    this.ownerDocument.documentStore.connect(node)

    return node
  }
}
