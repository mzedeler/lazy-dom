import { Future } from "../types/Future"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Element } from "./Element"
import { HTMLBodyElement } from "./elements/HTMLBodyElement"
import { Text } from "./Text"
import { EventTarget } from "../types/EventTarget"
import { Listener } from "../types/Listener"
import { Event } from "./Event"
import { HTMLDivElement } from "./elements/HTMLDivElement"
import { HTMLImageElement } from "./elements/HTMLImageElement"
import { HTMLHeadingElement } from "./elements/HTMLHeadingElement"
import { HTMLLabelElement } from "./elements/HTMLLabelElement"
import { HTMLInputElement } from "./elements/HTMLInputElement"
import { HTMLButtonElement } from "./elements/HTMLButtonElement"
import { HTMLFormElement } from "./elements/HTMLFormElement"
import { HTMLSpanElement } from "./elements/HTMLSpanElement"
import { HTMLUListElement } from "./elements/HTMLUListElement"
import { Attr } from "./Attr"
import { Node } from './Node'
import { HTMLAnchorElement } from "./elements/HTMLAnchorElement"

const subtree = (node: Node): Set<Node> => {
  const stack: Node[] = [node]
  const result: Set<Node> = new Set()

  do {
    const nextNode = stack.shift()
    if (nextNode) {
      result.add(nextNode)
      if (nextNode instanceof Element) {
        stack.push(...nextNode.childNodes)
      }
    }
  } while (stack.length)

  return result
}

class DocumentStore  {
  elements: Future<Element[]> = () => []

  nodeType = () => NodeTypes.DOCUMENT_NODE

  body: Future<HTMLBodyElement> = () => {
    throw valueNotSetError('body')
  }

  disconnect(node: Node) {
    const elementsFuture = this.elements
    this.elements = () => {
      const remove = subtree(node)
      return elementsFuture().filter(otherNode => !remove.has(otherNode))
    }
  }

  connect(node: Node) {
    const elementsFuture = this.elements
    this.elements = () => {
      const newNodes = subtree(node)
      const result = new Set(elementsFuture ? elementsFuture() : [])
      newNodes.forEach(node => {
        if (node instanceof Element) {
          result.add(node)
        }
      })
      return Array.from(result)
    }
  }
}

export class Document implements EventTarget {
  documentStore = new DocumentStore()

  debug() {
    return this.documentStore.elements()
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
    return this.documentStore.elements().filter(x => x.parent)
  }

  get body(): HTMLBodyElement {
    return this.documentStore.body()
  }

  createElement(localName: string): Element {
    let element: Element
    switch(localName.toUpperCase()) {
      case 'A': element = new HTMLAnchorElement(); break;
      case 'BUTTON': element = new HTMLButtonElement(); break;
      case 'FORM': element = new HTMLFormElement(); break;
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6': element = new HTMLHeadingElement(); break;
      case 'LABEL': element = new HTMLLabelElement(); break;
      case 'DIV': element = new HTMLDivElement(); break;
      case 'IMG': element = new HTMLImageElement(); break;
      case 'INPUT': element = new HTMLInputElement(); break;
      case 'SPAN': element = new HTMLSpanElement(); break;
      case 'UL': element = new HTMLUListElement(); break;
      default: throw new Error('unknown element name: ' + localName)
    }

    element.elementStore.tagName = () => localName
    element.nodeStore.ownerDocument = () => this

    return element
  }

  _disconnect(node: Node) {
    if (node instanceof Element) {
      const elementsFuture = this.documentStore.elements
      this.documentStore.elements = () => {
        return (elementsFuture ? elementsFuture() : [])
          .filter(otherNode => otherNode !== node)
      }
    }
  }

  createTextNode(data: string): Text {
    const textNode = new Text()
    textNode.nodeStore.ownerDocument = () => this
    textNode.textStore.data = () => data
    return textNode
  }

  getElementById(id: string): Element | null {
    const attributeMatchingId = (attribute: Attr) => attribute
      .name === 'id' && attribute.value === id 
    const elementMatchingId = (element: Element) => [...element
      .attributes]
      .find(attributeMatchingId)

    return this
      .documentStore
      .elements()
      .find(elementMatchingId) || null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatchEvent(event: Event) {

  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addEventListener(type: string, listener: Listener) {

  }
}
