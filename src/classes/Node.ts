import { Future } from "../types/Future"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Document } from "./Document"
import { Element } from "./Element"

let nextInstance = 1
class NodeStore<NV = null> {
  nodeType: Future<NodeTypes> = () => {
    throw valueNotSetError('nodeType')
  }
  ownerDocument: Future<Document> = () => {
    throw valueNotSetError('ownerDocument')
  }
  parent: Future<Node | undefined> = () => undefined
  childNodes: Future<Array<Node>> = () => []
  nodeValue: Future<NV> = () => {
    throw valueNotSetError('nodeValue')
  }
}

export abstract class Node<NV = null> {
  instance = nextInstance++
  nodeStore = new NodeStore<NV>()

  dump(): string {
    return this.nodeType + ':' + this.instance + ((this instanceof Element) ? ':' + this.tagName : '')
  }

  get nodeType(): NodeTypes {
    return this.nodeStore.nodeType()
  }

  get ownerDocument(): Document {
    return this.nodeStore.ownerDocument()
  }

  get parent(): Node | undefined {
    return this.nodeStore.parent()
  }

  get parentNode(): Node | undefined {
    return this.nodeStore.parent()
  }

  get childNodes() {
    return this.nodeStore.childNodes()
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
    node.nodeStore.parent = () => undefined

    // Validation: node not child: throw NotFoundError DOMException
    const previousChildNodesFuture = this.nodeStore.childNodes
    this.nodeStore.childNodes = () => {
      return previousChildNodesFuture().filter(childNode => childNode !== node)
    }

    this.ownerDocument.documentStore.disconnect(node)

    return node
  }

  appendChild(node: Node) {
    node.nodeStore.parent = () => this

    const previousChildNodesFuture = this.nodeStore.childNodes
    this.nodeStore.childNodes = () => {
      const childNodes = previousChildNodesFuture()
      childNodes.push(node)
      return childNodes
    }

    this.ownerDocument.documentStore.connect(node)

    return node
  }
}
