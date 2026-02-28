import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Element } from "./Element"
import { HTMLBodyElement } from "./elements/HTMLBodyElement"
import { Text } from "./Text"
import { Comment } from "./Comment"
import { DocumentFragment } from "./DocumentFragment"
import { ProcessingInstruction } from "./ProcessingInstruction"
import { Attr } from "./Attr"
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
import { HTMLAreaElement } from "./elements/HTMLAreaElement"
import { HTMLBRElement } from "./elements/HTMLBRElement"
import { HTMLBaseElement } from "./elements/HTMLBaseElement"
import { HTMLDListElement } from "./elements/HTMLDListElement"
import { HTMLFieldSetElement } from "./elements/HTMLFieldSetElement"
import { HTMLHRElement } from "./elements/HTMLHRElement"
import { HTMLHtmlElement } from "./elements/HTMLHtmlElement"
import { HTMLIFrameElement } from "./elements/HTMLIFrameElement"
import { HTMLLegendElement } from "./elements/HTMLLegendElement"
import { HTMLLinkElement } from "./elements/HTMLLinkElement"
import { HTMLMapElement } from "./elements/HTMLMapElement"
import { HTMLMetaElement } from "./elements/HTMLMetaElement"
import { HTMLModElement } from "./elements/HTMLModElement"
import { HTMLOListElement } from "./elements/HTMLOListElement"
import { HTMLObjectElement } from "./elements/HTMLObjectElement"
import { HTMLOptGroupElement } from "./elements/HTMLOptGroupElement"
import { HTMLOptionElement } from "./elements/HTMLOptionElement"
import { HTMLParamElement } from "./elements/HTMLParamElement"
import { HTMLQuoteElement } from "./elements/HTMLQuoteElement"
import { HTMLScriptElement } from "./elements/HTMLScriptElement"
import { HTMLSelectElement } from "./elements/HTMLSelectElement"
import { HTMLStyleElement } from "./elements/HTMLStyleElement"
import { HTMLTableElement } from "./elements/HTMLTableElement"
import { HTMLTableCaptionElement } from "./elements/HTMLTableCaptionElement"
import { HTMLTableCellElement } from "./elements/HTMLTableCellElement"
import { HTMLTableColElement } from "./elements/HTMLTableColElement"
import { HTMLTableRowElement } from "./elements/HTMLTableRowElement"
import { HTMLTableSectionElement } from "./elements/HTMLTableSectionElement"
import { HTMLTextAreaElement } from "./elements/HTMLTextAreaElement"
import { HTMLTitleElement } from "./elements/HTMLTitleElement"
import { HTMLCollection } from "./HTMLCollection"
import { DOMImplementation } from "./DOMImplementation"
import { DOMException } from "./DOMException"
import { Window } from "./Window"
import * as nodeOps from "../wasm/nodeOps"
import * as NodeRegistry from "../wasm/NodeRegistry"

export class DocumentStore {
  wasmDocId: number

  body: () => HTMLBodyElement = () => {
    throw valueNotSetError('body')
  }

  head: () => HTMLElement = () => {
    throw valueNotSetError('head')
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
    AREA: HTMLAreaElement,
    BR: HTMLBRElement,
    BASE: HTMLBaseElement,
    DL: HTMLDListElement,
    FIELDSET: HTMLFieldSetElement,
    HR: HTMLHRElement,
    HTML: HTMLHtmlElement,
    IFRAME: HTMLIFrameElement,
    LEGEND: HTMLLegendElement,
    LINK: HTMLLinkElement,
    MAP: HTMLMapElement,
    META: HTMLMetaElement,
    INS: HTMLModElement,
    DEL: HTMLModElement,
    OL: HTMLOListElement,
    OBJECT: HTMLObjectElement,
    OPTGROUP: HTMLOptGroupElement,
    OPTION: HTMLOptionElement,
    PARAM: HTMLParamElement,
    BLOCKQUOTE: HTMLQuoteElement,
    Q: HTMLQuoteElement,
    SCRIPT: HTMLScriptElement,
    SELECT: HTMLSelectElement,
    STYLE: HTMLStyleElement,
    TABLE: HTMLTableElement,
    CAPTION: HTMLTableCaptionElement,
    TD: HTMLTableCellElement,
    TH: HTMLTableCellElement,
    COL: HTMLTableColElement,
    COLGROUP: HTMLTableColElement,
    TR: HTMLTableRowElement,
    THEAD: HTMLTableSectionElement,
    TBODY: HTMLTableSectionElement,
    TFOOT: HTMLTableSectionElement,
    TEXTAREA: HTMLTextAreaElement,
    TITLE: HTMLTitleElement,
    CANVAS: HTMLElement,
    BODY: HTMLBodyElement,
    HEAD: HTMLElement,
  },
  'http://www.w3.org/2000/svg': {
    PATH: SVGPathElement,
    SVG: SVGElement,
  }
}

export class Document implements EventTarget {
  documentStore = new DocumentStore()
  defaultView: Window | null = null
  readonly implementation = new DOMImplementation()

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

    this.documentStore.head = () => {
      const head = new HTMLElement()
      this.documentStore.head = () => head
      head.elementStore.tagName = () => 'HEAD'
      head.nodeStore.ownerDocument = () => this
      return head
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
  createElementNS(namespaceURI: string | null, qualifiedName: string, options?: { is: string }) {
    // Parse prefix:localName
    let prefix: string | null = null
    let localName = qualifiedName
    const colonIndex = qualifiedName.indexOf(':')
    if (colonIndex >= 0) {
      prefix = qualifiedName.substring(0, colonIndex)
      localName = qualifiedName.substring(colonIndex + 1)
    }

    // NAMESPACE_ERR checks
    if (prefix !== null && namespaceURI === null) {
      throw new DOMException(
        "Namespace is null but prefix is not null.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }
    if (prefix === 'xml' && namespaceURI !== 'http://www.w3.org/XML/1998/namespace') {
      throw new DOMException(
        "Prefix 'xml' requires namespace 'http://www.w3.org/XML/1998/namespace'.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }

    const constructor = (namespaceURI ? constructors[namespaceURI]?.[localName.toUpperCase()] : null) ?? HTMLElement

    const element = new constructor()
    element.elementStore.tagName = () => qualifiedName
    element.elementStore.namespaceURI = () => namespaceURI
    element.nodeStore.ownerDocument = () => this

    return element
  }

  createElement(localName: string): Element {
    const constructor = constructors['http://www.w3.org/1999/xhtml'][localName.toUpperCase()] ?? HTMLElement

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

  createComment(data: string): Comment {
    const comment = new Comment(data)
    comment.nodeStore.ownerDocument = () => this
    return comment
  }

  createDocumentFragment(): DocumentFragment {
    const fragment = new DocumentFragment()
    fragment.nodeStore.ownerDocument = () => this
    return fragment
  }

  createProcessingInstruction(target: string, data: string): ProcessingInstruction {
    const pi = new ProcessingInstruction(target, data)
    pi.nodeStore.ownerDocument = () => this
    return pi
  }

  createAttribute(localName: string): Attr {
    return new Attr(null, localName, '')
  }

  createAttributeNS(namespaceURI: string | null, qualifiedName: string): Attr {
    let prefix: string | null = null
    let localName = qualifiedName
    const colonIndex = qualifiedName.indexOf(':')
    if (colonIndex >= 0) {
      prefix = qualifiedName.substring(0, colonIndex)
      localName = qualifiedName.substring(colonIndex + 1)
    }

    // NAMESPACE_ERR checks
    if (prefix !== null && namespaceURI === null) {
      throw new DOMException(
        "Namespace is null but prefix is not null.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }
    if (prefix === 'xml' && namespaceURI !== 'http://www.w3.org/XML/1998/namespace') {
      throw new DOMException(
        "Prefix 'xml' requires namespace 'http://www.w3.org/XML/1998/namespace'.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }
    if (qualifiedName === 'xmlns' && namespaceURI !== 'http://www.w3.org/2000/xmlns/') {
      throw new DOMException(
        "'xmlns' requires namespace 'http://www.w3.org/2000/xmlns/'.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }
    if (prefix === 'xmlns' && namespaceURI !== 'http://www.w3.org/2000/xmlns/') {
      throw new DOMException(
        "Prefix 'xmlns' requires namespace 'http://www.w3.org/2000/xmlns/'.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }

    return new Attr(null, localName, '', namespaceURI, prefix)
  }

  importNode(importedNode: Node, deep: boolean = false): Node {
    const clone = importedNode.cloneNode(deep)
    this._setOwnerDocument(clone)
    return clone
  }

  private _setOwnerDocument(node: Node) {
    node.nodeStore.ownerDocument = () => this
    const children = node.nodeStore.getChildNodesArray()
    for (const child of children) {
      this._setOwnerDocument(child)
    }
  }

  getElementsByTagName(tagName: string): Element[] {
    return this.body.getElementsByTagName(tagName)
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

  querySelector(selectors: string): Element | null {
    return this.body.querySelector(selectors)
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

  get nodeType() {
    return NodeTypes.DOCUMENT_NODE
  }

  get nodeName() {
    return '#document'
  }

  get nodeValue() {
    return null
  }

  set nodeValue(_value: any) {
    // Setting nodeValue on Document has no effect per spec
  }

  get attributes() {
    return null
  }

  get location() {
    return this.defaultView!.location
  }

  get referrer() {
    return ''
  }

  get head(): HTMLElement {
    return this.documentStore.head()
  }

  // should be html, but body for now
  get documentElement() {
    return this.body
  }
}
