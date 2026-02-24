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
import { Node } from './Node/Node'
import { HTMLAnchorElement } from "./elements/HTMLAnchorElement"
import { HTMLPreElement } from "./elements/HTMLPreElement"
import { HTMLParagraphElement } from "./elements/HTMLParagraphElement"
import { HTMLElement } from "./elements/HTMLElement"
import { SVGPathElement } from "./elements/SVGPathElement"
import { SVGElement } from "./elements/SVGElement"
import { HTMLLIElement } from "./elements/HTMLLIElement"
import { HTMLCollection } from "./HTMLCollection"
import { Window } from "./Window"
import * as nodeOps from "../wasm/nodeOps"
import * as NodeRegistry from "../wasm/NodeRegistry"

export class DocumentStore {
  wasmDocId: number

  body: () => HTMLBodyElement = () => {
    throw valueNotSetError('body')
  }

  constructor() {
    this.wasmDocId = nodeOps.createDocument()
  }

  disconnect(node: Node) {
    nodeOps.disconnectSubtree(this.wasmDocId, node.wasmId)
  }

  connect(node: Node) {
    nodeOps.connectSubtree(this.wasmDocId, node.wasmId)
  }

  get elements(): Element[] {
    const ids = nodeOps.getConnectedElementIds(this.wasmDocId)
    const result: Element[] = []
    for (let i = 0; i < ids.length; i++) {
      const node = NodeRegistry.getNode(ids[i])
      if (node instanceof Element) {
        result.push(node)
      }
    }
    return result
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
  defaultView: Window | null = null

  debug() {
    return this.documentStore.elements
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
    return this.documentStore.elements.filter(x => x.parent)
  }

  get body(): HTMLBodyElement {
    return this.documentStore.body()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createElementNS(namespaceURI: keyof typeof constructors, qualifiedName: string, options?: { is: string }) {
    const constructor = constructors[namespaceURI][qualifiedName.toUpperCase()]
    if (!constructor) {
      throw new Error('Unknown element name: ' + qualifiedName + ' with namespace ' + namespaceURI)
    }

    const element = new constructor()
    element.elementStore.tagName = () => qualifiedName
    element.elementStore.namespaceURI = () => namespaceURI
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
      nodeOps.disconnectElement(this.documentStore.wasmDocId, node.wasmId)
    }
  }

  createTextNode(data: string): Text {
    const textNode = new Text()
    textNode.nodeStore.ownerDocument = () => this
    textNode.textStore.data = () => data
    return textNode
  }

  getElementById(id: string): Element | null {
    const elementMatchingId = (element: Element) => element.getAttribute('id') === id

    return this
      .documentStore
      .elements
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

  getElementsByTagNameNS(namespaceURI: string, localName: string) {
    const filter = (element: Element) => {
      return element.tagName.toUpperCase() === localName.toUpperCase() && element.namespaceURI === namespaceURI
    }

    const documentStore = this.documentStore

    class ByTagNameNSCollection extends HTMLCollection {
      filter: (element: Element) => boolean
      constructor(filter: (element: Element) => boolean) {
        super()
        this.filter = filter
      }

      item(index: number) {
        return documentStore
          .elements
          .filter(filter)
          .at(index) || null
      }

      get length() {
        return documentStore
          .elements
          .filter(filter)
          .length
      }

      namedItem(key: string) {
        return documentStore
          .elements
          .filter(filter)
          .find(element => element.getAttribute('name') === key || element.getAttribute('id') === key) || null
      }
    }

    return new ByTagNameNSCollection(filter)
  }

  // should be html, but body for now
  get documentElement() {
    return this.body
  }
}
