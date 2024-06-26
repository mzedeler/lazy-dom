import { Future } from "../types/Future"
import { Listeners } from "../types/Listeners"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Text } from "./Text"
import { Node } from "./Node"
import { Event } from "./Event"
import { EventTarget } from "../types/EventTarget"
import { PointerEvent } from "./PointerEvent"

class ElementStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError('tagName')
  }
  childNodes: Future<Array<Node>> = () => []
  style: Future<Record<string, unknown>> = () => ({})
}

const isEventTarget = (node: unknown): node is EventTarget =>
  Boolean((node as EventTarget).addEventListener && (node as EventTarget).dispatchEvent)


let x = 0
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
    return ''
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

  attributes() {
    return []
  }

  setAttribute() {
    return
  }

  removeChild(node: Node): Node {
    node.nodeStore.parent = () => undefined

    // Validation: node not child: throw NotFoundError DOMException

    const elementsFuture = node.ownerDocument.lookupStore.elements
    node.ownerDocument.lookupStore.elements = () => {
      const stack: Node[] = [node]
      const remove: Node[] = []
      do {
        const nextNode = stack.shift()
        if (nextNode) {
          remove.push(nextNode)
          if (node instanceof Element) {
            stack.push(...node.childNodes)
          }
        }
      } while (stack.length)
      return elementsFuture().filter(otherNode => !remove.includes(otherNode))
    }

    const previousChildNodesFuture = this.elementStore.childNodes
    this.elementStore.childNodes = () => {
      return previousChildNodesFuture().filter(childNode => childNode !== node)
    }

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

  querySelector(query: string) {
    return new Element()
  }

  querySelectorAll(query: string) {
    return this.ownerDocument.all
  }
}
