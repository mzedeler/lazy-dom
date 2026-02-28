import { NodeTypes } from "../types/NodeTypes"
import { Element } from "./Element"

export class Attr {
  constructor(ownerElement: Element | null, localName: string, value: string, namespaceURI: string | null = null, prefix: string | null = null) {
    this.ownerElement = ownerElement
    this.localName = localName
    this.value = value
    this.namespaceURI = namespaceURI
    this.prefix = prefix
  }

  ownerElement: Element | null
  readonly localName: string
  value: string

  readonly namespaceURI: string | null
  readonly prefix: string | null
  readonly specified = true

  readonly nodeType = NodeTypes.ATTRIBUTE_NODE
  readonly parentNode = null
  readonly nextSibling = null
  readonly previousSibling = null
  readonly childNodes: never[] = []
  readonly attributes = null

  get name() {
    if (this.prefix) {
      return this.prefix + ':' + this.localName
    }
    return this.localName
  }

  get nodeName() {
    return this.name
  }

  get nodeValue() {
    return this.value
  }

  set nodeValue(val: string) {
    this.value = val
  }
}
