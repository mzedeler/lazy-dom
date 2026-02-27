import { Element } from "./Element"

export class Attr {
  constructor(ownerElement: Element | null, localName: string, value: string) {
    this.ownerElement = ownerElement
    this.localName = localName
    this.value = value
  }

  readonly ownerElement: Element | null
  readonly localName: string
  value: string

  readonly namespaceURI = null
  readonly prefix = null
  readonly specified = true

  get name() {
    return this.localName
  }

}
