import { NodeTypes } from "../../types/NodeTypes"

import { Document } from "../Document"
import { Element } from "../Element"
import { NodeStore } from "./NodeStore"
import { ChildNodeList } from "./ChildNodeList"
import { invariant } from "../../utils/invariant"

function* lazyFilter<T>(iterator: Iterator<T>, test: (t: T) => boolean): Iterator<T> {
  for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
    if (test(value)) {
      yield value
    }
  }
}

function* lazyAppend<T>(iterator: Iterator<T>, last: T): Iterator<T> {
  invariant('next' in iterator, 'iterator must have next()')
  for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
    yield value
  }
  yield last
}

let nextInstance = 1
export abstract class Node<NV = null> {
  instance = nextInstance++
  nodeStore: NodeStore<NV>
  readonly _childNodes: ChildNodeList<NV>

  constructor() {
    this.nodeStore = new NodeStore<NV>()
    this._childNodes = new ChildNodeList<NV>(this.nodeStore)
  }

  dump(): string {
    return this.nodeType + ':' + this.instance + ((this instanceof Element) ? ':' + this.tagName : '')
  }

  get childNodes() {
    return this._childNodes
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

  get parentElement(): Element | null {
    const parent = this.nodeStore.parent()
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
    node.nodeStore.parent = () => undefined

    // Validation: if node is not child: throw NotFoundError DOMException
    const previousChildNodesFuture = this.nodeStore.childNodes
    this.nodeStore.childNodes = () => lazyFilter(
      previousChildNodesFuture(),
      (childNode: Node) => childNode !== node
    )
    this.ownerDocument.documentStore.disconnect(node)

    return node
  }

  appendChild(node: Node) {
    node.nodeStore.parent = () => this

    const previousChildNodesFuture = this.nodeStore.childNodes
    const iterator = previousChildNodesFuture()
    invariant('next' in iterator, 'iterator must have next()')

    this.nodeStore.childNodes = () => lazyAppend(
      previousChildNodesFuture(),
      node
    )

    this.ownerDocument.documentStore.connect(node)

    return node
  }
}
