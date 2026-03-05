import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"

export class DocumentType extends Node {
  readonly name: string
  readonly publicId: string
  readonly systemId: string

  constructor(name: string, publicId: string = '', systemId: string = '') {
    super(NodeTypes.DOCUMENT_TYPE_NODE)
    this.name = name
    this.publicId = publicId
    this.systemId = systemId
  }

  get nodeName(): string {
    return this.name
  }

  get nodeValue(): null {
    return null
  }

  set nodeValue(_value: string | null) {
    // Setting nodeValue on DocumentType has no effect per spec
  }

  get textContent(): null {
    return null
  }

  set textContent(_value: string | null) {
    // Setting textContent on DocumentType has no effect per spec
  }

  readonly attributes = null

  protected _cloneNodeShallow(): DocumentType {
    return new DocumentType(this.name, this.publicId, this.systemId)
  }
}
