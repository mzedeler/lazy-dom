import { Future } from "../types/Future"
import { Listeners } from "../types/Listeners"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Text } from "./Text"
import { Node } from "./Node/Node"
import { Event } from "./Event"
import { EventTarget } from "../types/EventTarget"
import { PointerEvent } from "./PointerEvent"
import { Attr } from "./Attr"
import { NamedNodeMap } from "./NamedNodeMap"
import { CssSelectAdapter } from "../utils/CssSelectAdapter"
import * as CSSselect from 'css-select'
import * as nodeOps from "../wasm/nodeOps"
import * as NodeRegistry from "../wasm/NodeRegistry"

const adapter = new CssSelectAdapter()

class ElementStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError('tagName')
  }
  style: Future<Record<string, unknown>> = () => ({})
  attributes: Future<NamedNodeMap> = () => new NamedNodeMap()
  namespaceURI: Future<string | null> = () => null
}

const isEventTarget = (node: unknown): node is EventTarget =>
  Boolean(node && (node as EventTarget).addEventListener && (node as EventTarget).dispatchEvent)

export class Element extends Node implements EventTarget {
  elementStore = new ElementStore()

  constructor() {
    super(NodeTypes.ELEMENT_NODE)
  }

  get ownerDocument() {
    return this.nodeStore.ownerDocument()
  }

  get tagName() {
    return this.elementStore.tagName().toUpperCase()
  }

  get nodeName() {
    return this.elementStore.tagName().toUpperCase()
  }

  get namespaceURI() {
    return this.elementStore.namespaceURI()
  }

  set namespaceURI(namespaceURI: string | null) {
    this.elementStore.namespaceURI = () => namespaceURI
  }

  get outerHTML() {
    const attributes = Object
      .values(this.elementStore.attributes().namedNodeMapStore.itemsLookup())
      .map((attr: Attr) => ' ' + attr.localName + '="' + attr.value + '"')
      .join('')

    const content = this.nodeStore.getChildNodesArray()
      .map((node: Node): string | void => {
        if (node instanceof Element) {
          return node.outerHTML
        } else if (node instanceof Text) {
          return node.data
        }
      })
      .filter(segment => Boolean(segment))
      .join('')
    return '<' + this.tagName.toLocaleLowerCase() + attributes + '>'
      + content
      + '</' + this.tagName.toLocaleLowerCase() + '>'
  }

  get style() {
    return this.elementStore.style()
  }

  get textContent(): string {
    const children = this.nodeStore.getChildNodesArray()
    const fragments = []
    for (const value of children) {
      if (value instanceof Text) {
        fragments.push(value.nodeValue)
      }
    }

    return fragments.join('')
  }

  set textContent(data: string) {
    // Clear all existing children from WASM
    nodeOps.clearChildren(this.wasmId)

    if (data.length) {
      const ownerDocument = this.nodeStore.ownerDocument()
      const textNode = ownerDocument.createTextNode(data)
      nodeOps.setParentId(textNode.wasmId, this.wasmId)
      nodeOps.appendChild(this.wasmId, textNode.wasmId)
    }
  }

  get attributes() {
    return this.elementStore.attributes()
  }

  setAttribute(localName: string, value: string) {
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      const attr = new Attr(this, localName, value)
      previousAttributes.setNamedItem(attr)
      return previousAttributes
    }
    return
  }

  removeAttribute(qualifiedName: string) {
    this.elementStore.attributes().removeNamedItem(qualifiedName)
  }

  get addEventListener(): EventTarget['addEventListener'] {
    return (type, listener) => {
      if (!listener) {
        return
      }
      const previousEventListenersFuture = this.elementStore.eventListeners
      this.elementStore.eventListeners = () => {
        const previousEventListeners = previousEventListenersFuture()
        let queue = previousEventListeners[type]
        if (!queue) {
          queue = []
        }
        queue.push(listener)
        previousEventListeners[type] = queue

        return previousEventListeners
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeEventListener(type: string, listener: unknown) {
    // Stub: event listener removal not fully implemented
  }

  dispatchEvent(event: Event) {
    const listeners = this.elementStore.eventListeners()
    const queue = listeners[event.type]
    if (queue && queue.length) {
      queue.forEach(listener => listener(event))
    } else {
      const parentId = nodeOps.getParentId(this.wasmId)
      const parent = parentId ? NodeRegistry.getNode(parentId) : undefined
      if (isEventTarget(parent)) {
        parent.dispatchEvent(event)
      }
    }
  }

  click() {
    const event = new PointerEvent()
    event.eventStore.type = () => 'click'
    event.eventStore.target = () => this
    this.dispatchEvent(event)
  }

  get hidden(): boolean {
    return this.hasAttribute('hidden')
  }

  hasAttribute(name: string): boolean {
    return this
      .elementStore
      .attributes()
      .getNamedItem(name) !== undefined
  }

  getAttribute(qualifiedName: string) {
    return this
      .elementStore
      .attributes()
      .getNamedItem(qualifiedName)?.value || null
  }

  getAttributeNode(qualifiedName: string): Attr | null {
    return this
      .elementStore
      .attributes()
      .getNamedItem(qualifiedName) ?? null
  }

  querySelectorAll(query: string) {
    return CSSselect.selectAll(query, this, { adapter })
  }

  matches(selectors: string): boolean {
    return CSSselect.is(this, selectors, { adapter })
  }

  querySelector(selectors: string): Element | null {
    return CSSselect.selectOne(selectors, this, { adapter })
  }
}
