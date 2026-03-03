import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"
import { Element } from "./Element"
import { Text } from "./Text"
import { Listener } from "../types/Listener"
import { AddEventListenerOptions } from "../types/Listeners"
import { Event } from "./Event"
import {
  EventTargetStore,
  addEventListenerImpl,
  removeEventListenerImpl,
  fireListenersAtTarget,
} from "./EventTargetImpl"

export class DocumentFragment extends Node {
  readonly nodeName = '#document-fragment'
  private _eventTargetStore = new EventTargetStore()

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
        if (child instanceof Text) return child.data
        return ''
      })
      .join('')
  }

  set textContent(value: string) {
    // Remove all existing children
    const children = this.nodeStore.getChildNodesArray()
    for (const child of children) {
      this.removeChild(child)
    }
    // Append a text node if value is non-empty
    if (value !== '') {
      this.appendChild(this.ownerDocument.createTextNode(value))
    }
  }

  addEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    addEventListenerImpl(this._eventTargetStore, type, listener, options)
  }

  removeEventListener(type: string, listener: unknown, options?: boolean | AddEventListenerOptions) {
    removeEventListenerImpl(this._eventTargetStore, type, listener as Listener, options)
  }

  dispatchEvent(event: Event): boolean {
    const type = event.type
    fireListenersAtTarget(this._eventTargetStore, type, event)
    return !event.defaultPrevented
  }

  protected _cloneNodeShallow(): DocumentFragment {
    const clone = this.ownerDocument.createDocumentFragment()
    return clone
  }
}
