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
import { HTMLPreElement } from "./elements/HTMLPreElement"
import { HTMLParagraphElement } from "./elements/HTMLParagraphElement"
import { HTMLElement } from "./elements/HTMLElement"
import { SVGPathElement } from "./elements/SVGPathElement"
import { SVGElement } from "./elements/SVGElement"
import { HTMLLIElement } from "./elements/HTMLLIElement"

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

type Constructor = new (...args: any[]) => HTMLElement | SVGElement

const constructors: Record<string, Record<string, Constructor>> = {
  'http://www.w3.org/1999/xhtml': {
    A: HTMLAnchorElement,
    BUTTON: HTMLButtonElement,
    FORM: HTMLFormElement,
    H1: HTMLHeadingElement,
    H2: HTMLHeadingElement,
    H3: HTMLHeadingElement,
    H4: HTMLHeadingElement,
    H5: HTMLHeadingElement,
    H6: HTMLHeadingElement,
    LABEL: HTMLLabelElement,
    DIV: HTMLDivElement,
    IMG: HTMLImageElement,
    INPUT: HTMLInputElement,
    LI: HTMLLIElement,
    SPAN: HTMLSpanElement,
    UL: HTMLUListElement,
    PRE: HTMLPreElement,
    P: HTMLParagraphElement,
    CODE: HTMLElement,
  },
  'http://www.w3.org/2000/svg': {
    PATH: SVGPathElement,
    SVG: SVGElement,
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

  createElementNS(namespaceURI: keyof typeof constructors, qualifiedName: string, options?: { is: string }) {
    const constructor = constructors[namespaceURI][qualifiedName.toUpperCase()]
    if (!constructor) {
      throw new Error('Unknown element name: ' + qualifiedName + ' with namespace ' + namespaceURI)
    }

    const element = new constructor()
    element.elementStore.tagName = () => qualifiedName
    element.nodeStore.ownerDocument = () => this

    return element
  }

  createElement(localName: string): Element {
    const constructor = constructors['http://www.w3.org/1999/xhtml'][localName.toUpperCase()]
    if (!constructor) {
      throw new Error('Unknown element name: ' + localName)
    }

    const element = new constructor()
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
    const elementMatchingId = (element: Element) => element.getAttribute('id') === id

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

  removeEventListener() {

  }

  querySelectorAll(query: string) {
    return this.body.querySelectorAll(query)
  }

  // should be html, but body for now
  get documentElement() {
    return this.body
  }
}
