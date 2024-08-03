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
    let element: Element
    switch(localName.toUpperCase()) {
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

    const elementsFuture = this.lookupStore.elements
    this.lookupStore.elements = () => {
      const result = elementsFuture ? elementsFuture() : []
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatchEvent(event: Event) {

  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addEventListener(type: string, listener: Listener) {

  }
}
