import { Future } from "../types/Future"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Element } from "./Element"
import { Body } from "./Body"
import { Text } from "./Text"

class LookupStore {
  elements: Future<Element[]> = () => []
}

class DocumentStore  {
  nodeType = () => NodeTypes.DOCUMENT_NODE

  body: Future<Body> = () => {
    throw valueNotSetError('body')
  }
}

export class Document {
  documentStore = new DocumentStore()
  lookupStore = new LookupStore()

  constructor() {
    this.documentStore.body = () => {
      const body = new Body()
      body.nodeStore.ownerDocument = () => this
      return body
    }
    Object.assign(this, NodeTypes)
  }

  get all(): Element[] {
    return this.lookupStore.elements().filter(x => x.parent)
  }

  get body(): Element {
    return this.documentStore.body()
  }

  createElement(localName: string): Element {
    const element = new Element()
    element.elementStore.tagName = () => localName
    element.nodeStore.ownerDocument = () => this

    const elements = this.lookupStore.elements
    const elementsFuture = () => {
      const result = elements ? elements() : []
      result.push(element)
      return result
    }
    this.lookupStore.elements = elementsFuture

    return element
  }

  createTextNode(data: string): Text {
    const textNode = new Text()
    textNode.nodeStore.ownerDocument = () => this
    textNode.textStore.data = () => data
    return textNode
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
