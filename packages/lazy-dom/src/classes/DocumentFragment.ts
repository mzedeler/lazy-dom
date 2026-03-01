import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"
import { Element } from "./Element"
import { CharacterData } from "./CharacterData"

export class DocumentFragment extends Node {
  readonly nodeName = '#document-fragment'

  constructor() {
    super(NodeTypes.DOCUMENT_FRAGMENT_NODE)
  }

  get nodeValue(): null {
    return null
  }

  set nodeValue(_value: string | null) {
    // Setting nodeValue on DocumentFragment has no effect per spec
  }

  get textContent(): string {
    return this.nodeStore.getChildNodesArray()
      .map(child => {
        if (child instanceof Element) return child.textContent
        if (child instanceof CharacterData) return child.data
        return ''
      })
      .join('')
  }

  protected _cloneNodeShallow(): DocumentFragment {
    const clone = this.ownerDocument.createDocumentFragment()
    return clone
  }
}
