import { Future } from "../types/Future"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Element } from "./Element"
import { HTMLBodyElement } from "./HTMLBodyElement"
import { Text } from "./Text"
import { EventTarget } from "../types/EventTarget"
import { Listener } from "../types/Listener"
import { Event } from "./Event"

class LookupStore {
  elements: Future<Element[]> = () => []
}

class DocumentStore  {
  nodeType = () => NodeTypes.DOCUMENT_NODE

  body: Future<HTMLBodyElement> = () => {
    throw valueNotSetError('body')
  }
}

export class Document implements EventTarget {
  documentStore = new DocumentStore()
  lookupStore = new LookupStore()

  debug() {
    return this.lookupStore.elements()
  }

  constructor() {
    this.documentStore.body = () => {
      const body = new HTMLBodyElement()
      this.documentStore.body = () => body
      body.nodeStore.ownerDocument = () => this
      return body
    }
    Object.assign(this, NodeTypes)
  }

  get all(): Element[] {
    return this.lookupStore.elements().filter(x => x.parent)
  }

  get body(): HTMLBodyElement {
    return this.documentStore.body()
  }

  createElement(localName: string): Element {
    const element = new Element()
    element.elementStore.tagName = () => localName
    element.nodeStore.ownerDocument = () => this

    const elements = this.lookupStore.elements
    this.lookupStore.elements = () => {
      const result = elements ? elements() : []
      result.push(element)
      return result
    }

    return element
  }

  createTextNode(data: string): Text {
    const textNode = new Text()
    textNode.nodeStore.ownerDocument = () => this
    textNode.textStore.data = () => data
    return textNode
  }

  dispatchEvent(event: Event) {

  }

  addEventListener(type: string, listener: Listener) {

  }
}

class Window {
  get location() {
    return {
      href: ''
    }
  }

  getComputedStyle() {
    return {}
  }
}

class HTMLIFrameElement {}

class Navigator {}
