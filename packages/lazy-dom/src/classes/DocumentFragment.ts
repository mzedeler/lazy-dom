import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"
import { Element } from "./Element"
import { Text } from "./Text"
import { Listener } from "../types/Listener"
import { AddEventListenerOptions } from "../types/Listeners"
import { Event } from "./Event"
import {
  EventTargetStore,
  disposedEventTargetStore,
  addEventListenerImpl,
  removeEventListenerImpl,
  fireListenersAtTarget,
} from "./EventTargetImpl"

import { getCurrentDocument } from "../utils/currentDocument"

export class DocumentFragment extends Node {
  readonly nodeName = '#document-fragment'
  private _eventTargetStore = new EventTargetStore()

  constructor() {
    super(NodeTypes.DOCUMENT_FRAGMENT_NODE)
    // Per spec, new DocumentFragment() sets ownerDocument to the
    // current global object's associated document.
    const globalDoc = getCurrentDocument()
    if (globalDoc) {
      this.nodeStore.ownerDocument = () => globalDoc
    }
  }

  override _dispose(): void {
    super._dispose()
    this._eventTargetStore = disposedEventTargetStore
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

  set textContent(value: string | null) {
    // Per spec, null is treated as empty string
    const coerced = value === null || value === undefined ? '' : String(value)
    // Remove all existing children
    const children = this.nodeStore.getChildNodesArray()
    for (const child of children) {
      this.removeChild(child)
    }
    // Append a text node if value is non-empty
    if (coerced !== '') {
      this.appendChild(this.ownerDocument.createTextNode(coerced))
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

  append(...nodes: (Node | string)[]) {
    for (const node of nodes) {
      if (typeof node === 'string') {
        this.appendChild(this.ownerDocument.createTextNode(node))
      } else {
        this.appendChild(node)
      }
    }
  }

  prepend(...nodes: (Node | string)[]) {
    const firstChild = this.firstChild
    for (const node of nodes) {
      const child = typeof node === 'string'
        ? this.ownerDocument.createTextNode(node)
        : node
      this.insertBefore(child, firstChild)
    }
  }

  replaceChildren(...nodes: (Node | string)[]) {
    while (this.firstChild) this.removeChild(this.firstChild)
    this.append(...nodes)
  }

  protected _cloneNodeShallow(): DocumentFragment {
    const clone = this.ownerDocument.createDocumentFragment()
    return clone
  }
}
