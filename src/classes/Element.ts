import { Future } from "../types/Future"
import { Listeners } from "../types/Listeners"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Text } from "./Text"
import { Node } from "./Node"
import { Event } from "./Event"
import { EventTarget } from "../types/EventTarget"
import { PointerEvent } from "./PointerEvent"
import { Attr } from "./Attr"
import { NamedNodeMap } from "./NamedNodeMap"

class ElementStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError('tagName')
  }
  childNodes: Future<Array<Node>> = () => []
  style: Future<Record<string, unknown>> = () => ({})
  attributes: Future<NamedNodeMap> = () => new NamedNodeMap()
}

const isEventTarget = (node: unknown): node is EventTarget =>
  Boolean((node as EventTarget).addEventListener && (node as EventTarget).dispatchEvent)


export class Element extends Node implements EventTarget {
  elementStore = new ElementStore()

  constructor() {
    super()
    this.nodeStore.nodeType = () => NodeTypes.ELEMENT_NODE
  }

  get ownerDocument() {
    return this.nodeStore.ownerDocument()
  }

  get tagName() {
    return this.elementStore.tagName().toUpperCase()
  }

  get outerHTML() {
    const attributes = Object
      .values(this.elementStore.attributes().namedNodeMapStore.itemsLookup())
      .map((attr: Attr) => ' ' + attr.localName + '="' + attr.value + '"')
      .join('')

    const content = this.childNodes
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

  get childNodes() {
    return this.elementStore.childNodes()
  }

  get style() {
    return this.elementStore.style()
  }

  get textContent(): string {
    return this.elementStore.childNodes().filter(childNode => childNode instanceof Text).join('')
  }

  set textContent(data: string) {
    const ownerDocumentFuture = this.nodeStore.ownerDocument
    this.elementStore.childNodes = () => data.length === 0 ? [] : [
      ownerDocumentFuture().createTextNode(data)
    ]
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

  removeChild(node: Node): Node {
    node.nodeStore.parent = () => undefined

    // Validation: node not child: throw NotFoundError DOMException
    const previousChildNodesFuture = this.elementStore.childNodes
    this.elementStore.childNodes = () => {
      return previousChildNodesFuture().filter(childNode => childNode !== node)
    }

    this.ownerDocument.documentStore.disconnect(node)

    return node
  }

  appendChild(node: Node) {
    node.nodeStore.parent = () => this

    const previousChildNodesFuture = this.elementStore.childNodes
    this.elementStore.childNodes = () => {
      const childNodes = previousChildNodesFuture()
      childNodes.push(node)
      return childNodes
    }

    this.ownerDocument.documentStore.connect(node)

    return node
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

  dispatchEvent(event: Event) {
    const listeners = this.elementStore.eventListeners()
    const queue = listeners[event.type]
    if (queue && queue.length) {
      queue.forEach(listener => listener(event))
    } else {
      const parent = this.nodeStore.parent()
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

  matches() {
    return false
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  querySelector(query: string) {
    throw new Error('unsupported method')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  querySelectorAll(query: string) {
    return this.ownerDocument.all
  }
}
