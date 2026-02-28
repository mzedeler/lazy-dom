import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"

export class DocumentFragment extends Node {
  readonly nodeName = '#document-fragment'

  constructor() {
    super(NodeTypes.DOCUMENT_FRAGMENT_NODE)
  }

  get nodeValue(): null {
    return null
  }

  set nodeValue(_value: any) {
    // Setting nodeValue on DocumentFragment has no effect per spec
  }

  get textContent(): string {
    return this.nodeStore.getChildNodesArray()
      .map(child => {
        if ('textContent' in child) return (child as any).textContent
        if ('data' in child) return (child as any).data
        return ''
      })
      .join('')
  }

  protected _cloneNodeShallow(): DocumentFragment {
    const clone = this.ownerDocument.createDocumentFragment()
    return clone
  }
}
