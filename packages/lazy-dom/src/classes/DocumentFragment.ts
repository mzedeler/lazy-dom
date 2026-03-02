import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"
import { Element } from "./Element"
import { Text } from "./Text"
import { Listener } from "../types/Listener"
import { Listeners, AddEventListenerOptions } from "../types/Listeners"
import { Event } from "./Event"

export class DocumentFragment extends Node {
  readonly nodeName = '#document-fragment'
  private _listeners: Listeners = {}

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
    if (!listener) return
    const capture = typeof options === 'boolean' ? options : (options?.capture ?? false)
    const passive = typeof options === 'boolean' ? false : (options?.passive ?? false)
    const once = typeof options === 'boolean' ? false : (options?.once ?? false)
    let queue = this._listeners[type]
    if (!queue) {
      queue = []
      this._listeners[type] = queue
    }
    queue.push({ listener, capture, passive, once })
  }

  removeEventListener(type: string, listener: unknown, options?: boolean | AddEventListenerOptions) {
    if (!listener) return
    const capture = typeof options === 'boolean' ? options : (options?.capture ?? false)
    const queue = this._listeners[type]
    if (queue) {
      const idx = queue.findIndex(
        entry => entry.listener === listener && entry.capture === capture
      )
      if (idx !== -1) {
        queue.splice(idx, 1)
      }
    }
  }

  dispatchEvent(event: Event): boolean {
    const type = event.type
    const queue = this._listeners[type]
    if (queue) {
      for (const entry of queue.slice()) {
        entry.listener(event)
      }
    }
    return !event.defaultPrevented
  }

  protected _cloneNodeShallow(): DocumentFragment {
    const clone = this.ownerDocument.createDocumentFragment()
    return clone
  }
}
