import { NodeTypes } from "../types/NodeTypes"
import { Future } from "../types/Future"
import { AddEventListenerOptions } from "../types/Listeners"
import { Listener } from "../types/Listener"
import valueNotSetError from "../utils/valueNotSetError"
import { parseHTML } from "../utils/parseHTML"

import { Element } from "./Element"
import { HTMLBodyElement } from "./elements/HTMLBodyElement"
import { Text } from "./Text"
import { Comment } from "./Comment"
import { DocumentFragment } from "./DocumentFragment"
import { ProcessingInstruction } from "./ProcessingInstruction"
import { Attr } from "./Attr"
import { EventTarget } from "../types/EventTarget"
import { Event } from "./Event"
import { UIEvent } from "./UIEvent"
import { MouseEvent } from "./MouseEvent"
import { KeyboardEvent } from "./KeyboardEvent"
import { FocusEvent } from "./FocusEvent"
import { InputEvent } from "./InputEvent"
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
import { HTMLUnknownElement } from "./elements/HTMLUnknownElement"
import { SVGPathElement } from "./elements/SVGPathElement"
import { SVGElement } from "./elements/SVGElement"
import { HTMLLIElement } from "./elements/HTMLLIElement"
import { HTMLAreaElement } from "./elements/HTMLAreaElement"
import { HTMLBRElement } from "./elements/HTMLBRElement"
import { HTMLBaseElement } from "./elements/HTMLBaseElement"
import { HTMLDListElement } from "./elements/HTMLDListElement"
import { HTMLFieldSetElement } from "./elements/HTMLFieldSetElement"
import { HTMLFrameElement } from "./elements/HTMLFrameElement"
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
import { HTMLCanvasElement } from "./elements/HTMLCanvasElement"
import { HTMLCollection } from "./HTMLCollection"
import { DOMImplementation } from "./DOMImplementation"
import { DOMException } from "./DOMException"
import { Window } from "./Window"
import { ErrorEvent } from "./ErrorEvent"
import { CustomEvent } from "./CustomEvent"
import { CompositionEvent } from "./CompositionEvent"
import { CSSStyleSheet } from "./CSSStyleSheet"
import { TreeWalker } from "./TreeWalker"
import { Range } from "./Range"
import { Selection } from "./Selection"
import * as nodeOps from "../wasm/nodeOps"
import * as NodeRegistry from "../wasm/NodeRegistry"
import {
  EventTargetStore,
  addEventListenerImpl,
  removeEventListenerImpl,
  fireListenersImpl,
  fireListenersAtTarget,
  fireOnHandler,
} from "./EventTargetImpl"
import { parseQualifiedName, validateNamespace } from "../utils/validateNamespace"
import { dispatchErrorToWindow } from "../utils/dispatchErrorToWindow"

export class DocumentStore {
  wasmDocId: number
  eventTargetStore = new EventTargetStore()
  cookie: Future<string> = () => ''
  activeElement: Future<Element | null> = () => null

  documentElement: () => HTMLHtmlElement = () => {
    throw valueNotSetError('documentElement')
  }

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

type Constructor = new (...args: unknown[]) => HTMLElement | SVGElement

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
    CANVAS: HTMLCanvasElement,
    BODY: HTMLBodyElement,
    HEAD: HTMLElement,
    // Common valid HTML elements that don't have specific classes
    ABBR: HTMLElement, ADDRESS: HTMLElement, ARTICLE: HTMLElement,
    ASIDE: HTMLElement, B: HTMLElement, BDI: HTMLElement, BDO: HTMLElement,
    CITE: HTMLElement, DATA: HTMLElement, DD: HTMLElement, DETAILS: HTMLElement,
    DFN: HTMLElement, DIALOG: HTMLElement, DT: HTMLElement, EM: HTMLElement,
    FIGCAPTION: HTMLElement, FIGURE: HTMLElement, FOOTER: HTMLElement,
    HEADER: HTMLElement, HGROUP: HTMLElement, I: HTMLElement,
    KBD: HTMLElement, MAIN: HTMLElement, MARK: HTMLElement,
    NAV: HTMLElement, NOSCRIPT: HTMLElement, OUTPUT: HTMLElement,
    PICTURE: HTMLElement, RP: HTMLElement, RT: HTMLElement, RUBY: HTMLElement,
    S: HTMLElement, SAMP: HTMLElement, SEARCH: HTMLElement,
    SECTION: HTMLElement, SMALL: HTMLElement, STRONG: HTMLElement,
    SUB: HTMLElement, SUMMARY: HTMLElement, SUP: HTMLElement,
    TEMPLATE: HTMLElement, TIME: HTMLElement, U: HTMLElement,
    VAR: HTMLElement, VIDEO: HTMLElement, AUDIO: HTMLElement,
    SOURCE: HTMLElement, TRACK: HTMLElement, WBR: HTMLElement,
    EMBED: HTMLElement, PROGRESS: HTMLElement, METER: HTMLElement,
    MENU: HTMLElement, SLOT: HTMLElement, DATALIST: HTMLElement,
    FONT: HTMLElement, FRAME: HTMLFrameElement, FRAMESET: HTMLElement,
  },
  'http://www.w3.org/2000/svg': {
    PATH: SVGPathElement,
    SVG: SVGElement,
  }
}

export class Document implements EventTarget {
  documentStore = new DocumentStore()
  defaultView: Window | null = null
  readonly implementation = new DOMImplementation(() => new Document())
  private _docChildren: Node[] = []

  // on* event handler properties — needed so `'oninput' in document` returns
  // true, which React's isEventSupported uses to detect input event support.
  onclick: ((ev: Event) => void) | null = null
  ondblclick: ((ev: Event) => void) | null = null
  onmousedown: ((ev: Event) => void) | null = null
  onmouseup: ((ev: Event) => void) | null = null
  onmousemove: ((ev: Event) => void) | null = null
  onmouseover: ((ev: Event) => void) | null = null
  onmouseout: ((ev: Event) => void) | null = null
  onkeydown: ((ev: Event) => void) | null = null
  onkeyup: ((ev: Event) => void) | null = null
  onkeypress: ((ev: Event) => void) | null = null
  onfocus: ((ev: Event) => void) | null = null
  onblur: ((ev: Event) => void) | null = null
  onchange: ((ev: Event) => void) | null = null
  oninput: ((ev: Event) => void) | null = null
  onsubmit: ((ev: Event) => void) | null = null
  onreset: ((ev: Event) => void) | null = null
  onscroll: ((ev: Event) => void) | null = null
  onresize: ((ev: Event) => void) | null = null
  onload: ((ev: Event) => void) | null = null
  onerror: ((ev: Event) => void) | null = null
  onselect: ((ev: Event) => void) | null = null
  ontouchstart: ((ev: Event) => void) | null = null
  ontouchmove: ((ev: Event) => void) | null = null
  ontouchend: ((ev: Event) => void) | null = null
  ontouchcancel: ((ev: Event) => void) | null = null

  debug() {
    return this.documentStore.elements
  }

  constructor() {
    // Lazy init: the entire html > head + body tree is built on first access
    const initTree = () => {
      const html = new HTMLHtmlElement()
      html.elementStore.tagName = () => 'HTML'
      html.elementStore.namespaceURI = () => 'http://www.w3.org/1999/xhtml'
      html.nodeStore.ownerDocument = () => this

      const head = new HTMLElement()
      head.elementStore.tagName = () => 'HEAD'
      head.elementStore.namespaceURI = () => 'http://www.w3.org/1999/xhtml'
      head.nodeStore.ownerDocument = () => this

      const body = new HTMLBodyElement()
      body.elementStore.namespaceURI = () => 'http://www.w3.org/1999/xhtml'
      body.nodeStore.ownerDocument = () => this

      // Build tree: html > head + body
      nodeOps.setParentId(head.wasmId, html.wasmId)
      nodeOps.appendChild(html.wasmId, head.wasmId)
      nodeOps.setParentId(body.wasmId, html.wasmId)
      nodeOps.appendChild(html.wasmId, body.wasmId)

      // Connect entire tree to document for element tracking
      this.documentStore.connect(html)

      // Track html as a document child
      html._parentDocument = this
      this._docChildren = [html]

      // Memoize all three
      this.documentStore.documentElement = () => html
      this.documentStore.body = () => body
      this.documentStore.head = () => head

      return { html, head, body }
    }

    // Any of the three accessors triggers full tree init
    this.documentStore.documentElement = () => {
      const { html } = initTree()
      return html
    }
    this.documentStore.body = () => {
      const { body } = initTree()
      return body
    }
    this.documentStore.head = () => {
      const { head } = initTree()
      return head
    }

    Object.assign(this, NodeTypes)
  }

  get all(): Element[] {
    return this.documentStore.elements.filter(x => x.parent)
  }

  get activeElement(): Element | null {
    return this.documentStore.activeElement() ?? this.body
  }

  hasFocus(): boolean {
    return this.documentStore.activeElement() !== null
  }

  get readyState(): string {
    return 'complete'
  }

  get scrollingElement(): Element {
    return this.documentElement
  }

  get body(): HTMLBodyElement {
    return this.documentStore.body()
  }

  get cookie(): string {
    return this.documentStore.cookie()
  }

  set cookie(value: string) {
    const cookieValue = value
    this.documentStore.cookie = () => cookieValue
  }

  createElementNS(namespaceURI: string | null, qualifiedName: string, _options?: { is: string }) {
    const { prefix, localName } = parseQualifiedName(qualifiedName)
    validateNamespace(prefix, namespaceURI, qualifiedName, false)

    const xhtmlNS = 'http://www.w3.org/1999/xhtml'
    const constructor = (namespaceURI ? constructors[namespaceURI]?.[localName.toUpperCase()] : null)
      ?? (namespaceURI === xhtmlNS ? HTMLUnknownElement : HTMLElement)

    const element = new constructor()
    element.elementStore.tagName = () => qualifiedName
    element.elementStore.namespaceURI = () => namespaceURI
    element.nodeStore.ownerDocument = () => this

    return element
  }

  createElement(localName: string): Element {
    // Validate tag name per spec
    if (!localName || !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(localName)) {
      throw new DOMException(
        `The tag name provided ('${localName}') is not a valid name.`,
        'InvalidCharacterError',
        DOMException.INVALID_CHARACTER_ERR
      )
    }

    const constructor = constructors['http://www.w3.org/1999/xhtml'][localName.toUpperCase()] ?? HTMLUnknownElement

    const element = new constructor()
    element.elementStore.tagName = () => localName
    element.elementStore.namespaceURI = () => 'http://www.w3.org/1999/xhtml'
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
    const { prefix, localName } = parseQualifiedName(qualifiedName)
    validateNamespace(prefix, namespaceURI, qualifiedName)

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
    return this.documentElement.getElementsByTagName(tagName)
  }

  getElementById(id: string): Element | null {
    const elementMatchingId = (element: Element) => element.getAttribute('id') === id

    return this
      .documentStore
      .elements
      .find(elementMatchingId) || null
  }

  dispatchEvent(event: Event): boolean {
    if (event.eventStore) {
      try {
        event.eventStore.target()
      } catch {
        event.eventStore.target = () => this as unknown as Node
      }
    }
    const type = event.eventStore ? event.eventStore.type() : event.type
    event.eventPhase = 2 // AT_TARGET
    event.currentTarget = this as unknown as Node
    fireListenersAtTarget(this.documentStore.eventTargetStore, type, event, (err) => this._dispatchErrorToWindow(err))
    fireOnHandler(this as unknown as Record<string, unknown>, type, event, (err) => this._dispatchErrorToWindow(err))
    event.eventPhase = 0
    event.currentTarget = null
    return !event.defaultPrevented
  }

  /** Fire only listeners matching the given capture flag (called by Element.dispatchEvent during propagation). */
  _fireListeners(type: string, event: Event, capture: boolean) {
    fireListenersImpl(this.documentStore.eventTargetStore, type, event, capture, (err) => this._dispatchErrorToWindow(err))
    if (!capture) {
      fireOnHandler(this as unknown as Record<string, unknown>, type, event, (err) => this._dispatchErrorToWindow(err))
    }
  }

  private _dispatchErrorToWindow(err: unknown) {
    dispatchErrorToWindow(() => this.defaultView, err)
  }

  addEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    addEventListenerImpl(this.documentStore.eventTargetStore, type, listener, options)
  }

  removeEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    removeEventListenerImpl(this.documentStore.eventTargetStore, type, listener, options)
  }

  querySelectorAll(query: string) {
    return this.documentElement.querySelectorAll(query)
  }

  querySelector(selectors: string): Element | null {
    return this.documentElement.querySelector(selectors)
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

  // Node-like properties and methods for React compatibility
  readonly ELEMENT_NODE = NodeTypes.ELEMENT_NODE
  readonly ATTRIBUTE_NODE = NodeTypes.ATTRIBUTE_NODE
  readonly TEXT_NODE = NodeTypes.TEXT_NODE
  readonly PROCESSING_INSTRUCTION_NODE = NodeTypes.PROCESSING_INSTRUCTION_NODE
  readonly COMMENT_NODE = NodeTypes.COMMENT_NODE
  readonly DOCUMENT_NODE = NodeTypes.DOCUMENT_NODE
  readonly DOCUMENT_TYPE_NODE = NodeTypes.DOCUMENT_TYPE_NODE
  readonly DOCUMENT_FRAGMENT_NODE = NodeTypes.DOCUMENT_FRAGMENT_NODE

  get nodeType() {
    return NodeTypes.DOCUMENT_NODE
  }

  get nodeName() {
    return '#document'
  }

  get nodeValue() {
    return null
  }

  set nodeValue(_value: string | null) {
    // Setting nodeValue on Document has no effect per spec
  }

  get attributes() {
    return null
  }

  get ownerDocument(): null {
    return null
  }

  get parentNode(): null {
    return null
  }

  get parentElement(): null {
    return null
  }

  private _ensureInit() {
    if (this._docChildren.length === 0) {
      // Trigger lazy init by accessing documentElement
      void this.documentStore.documentElement()
    }
  }

  get childNodes(): Node[] {
    this._ensureInit()
    return this._docChildren
  }

  get firstChild(): Node | null {
    this._ensureInit()
    return this._docChildren[0] ?? null
  }

  get lastChild(): Node | null {
    this._ensureInit()
    return this._docChildren[this._docChildren.length - 1] ?? null
  }

  get nextSibling(): null {
    return null
  }

  get previousSibling(): null {
    return null
  }

  hasChildNodes(): boolean {
    this._ensureInit()
    return this._docChildren.length > 0
  }

  get isConnected(): boolean {
    return true
  }

  get textContent(): null {
    return null
  }

  set textContent(_value: string | null) {
    // Setting textContent on Document has no effect per spec
  }

  appendChild(node: Node): Node {
    // Remove from old parent if needed
    const oldParentId = nodeOps.getParentId(node.wasmId)
    if (oldParentId !== 0) {
      nodeOps.removeChild(oldParentId, node.wasmId)
    }

    node._parentDocument = this
    this._docChildren.push(node)
    this.documentStore.connect(node)

    // Update documentElement/body/head references if applicable
    if (node instanceof HTMLHtmlElement) {
      this.documentStore.documentElement = () => node
    }

    return node
  }

  insertBefore(newNode: Node, referenceNode: Node | null): Node {
    if (referenceNode === null) {
      return this.appendChild(newNode)
    }

    const refIdx = this._docChildren.indexOf(referenceNode)
    if (refIdx === -1) {
      throw new DOMException(
        "The node before which the new node is to be inserted is not a child of this node.",
        'NotFoundError',
        DOMException.NOT_FOUND_ERR
      )
    }

    // Remove from old parent if needed
    const oldParentId = nodeOps.getParentId(newNode.wasmId)
    if (oldParentId !== 0) {
      nodeOps.removeChild(oldParentId, newNode.wasmId)
    }

    newNode._parentDocument = this
    this._docChildren.splice(refIdx, 0, newNode)
    this.documentStore.connect(newNode)

    if (newNode instanceof HTMLHtmlElement) {
      this.documentStore.documentElement = () => newNode
    }

    return newNode
  }

  removeChild(node: Node): Node {
    const idx = this._docChildren.indexOf(node)
    if (idx === -1) {
      throw new DOMException(
        "The node to be removed is not a child of this node.",
        'NotFoundError',
        DOMException.NOT_FOUND_ERR
      )
    }

    this._docChildren.splice(idx, 1)
    node._parentDocument = null
    this.documentStore.disconnect(node)

    return node
  }

  replaceChild(newChild: Node, oldChild: Node): Node {
    const idx = this._docChildren.indexOf(oldChild)
    if (idx === -1) {
      throw new DOMException(
        "The node to be removed is not a child of this node.",
        'NotFoundError',
        DOMException.NOT_FOUND_ERR
      )
    }

    // Remove newChild from old parent if needed
    const oldParentId = nodeOps.getParentId(newChild.wasmId)
    if (oldParentId !== 0) {
      nodeOps.removeChild(oldParentId, newChild.wasmId)
    }

    this._docChildren[idx] = newChild
    oldChild._parentDocument = null
    newChild._parentDocument = this
    this.documentStore.disconnect(oldChild)
    this.documentStore.connect(newChild)

    if (newChild instanceof HTMLHtmlElement) {
      this.documentStore.documentElement = () => newChild
    }

    return oldChild
  }

  contains(other: Node | null): boolean {
    if (!other) return false
    if (this._docChildren.includes(other)) return true
    for (const child of this._docChildren) {
      if (child.contains(other)) return true
    }
    return false
  }

  cloneNode(_deep: boolean = false): Document {
    return new Document()
  }

  compareDocumentPosition(other: Node): number {
    return this.documentElement.compareDocumentPosition(other)
  }

  isSameNode(other: unknown): boolean {
    return this === other
  }

  getRootNode(): Document {
    return this
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

  get documentElement(): HTMLHtmlElement {
    return this.documentStore.documentElement()
  }

  get styleSheets(): CSSStyleSheet[] {
    return this.documentStore.elements
      .filter((el): el is HTMLStyleElement => el instanceof HTMLStyleElement)
      .map(el => el.sheet)
  }

  createTreeWalker(root: Node, whatToShow?: number, filter?: { acceptNode: (node: Node) => number } | null): TreeWalker {
    return new TreeWalker(root, whatToShow ?? 0xFFFFFFFF, filter ?? null)
  }

  open() {
    // Clear the document's head and body children for rewriting
    const head = this.head
    if (head) {
      while (head.firstChild) head.removeChild(head.firstChild)
    }
    const body = this.body
    if (body) {
      while (body.firstChild) body.removeChild(body.firstChild)
    }
    return this
  }

  close() {}

  write(html: string) {
    // Parse the HTML and append nodes to the document
    if (!html) return
    const nodes = parseHTML(html, this)

    // Check if the parsed HTML contains an <html> element (full-document write)
    for (const node of nodes) {
      if (node instanceof Element && node.tagName.toLowerCase() === 'html') {
        // Merge the parsed <html> element's children into the document structure
        this._mergeDocumentChildren(node as Element)
        return
      }
    }

    // No <html> found — append to body (default behavior)
    let target: Node = this.body
    if (!target) {
      try {
        target = this.documentElement
      } catch {
        return
      }
    }
    for (const node of nodes) {
      target.appendChild(node)
    }
  }

  /** Merge children of a parsed <html> element into the document's head and body. */
  private _mergeDocumentChildren(htmlElement: Element) {
    // Copy attributes from parsed <html> to documentElement
    for (const attr of Array.from(htmlElement.attributes)) {
      this.documentElement.setAttribute(attr.name, attr.value)
    }

    // Tags that belong in <head> per the HTML spec
    const headTags = new Set(['meta', 'title', 'link', 'style', 'base', 'script', 'noscript'])

    // Snapshot children since appendChild moves nodes
    const children = htmlElement.nodeStore.getChildNodesArray()
    for (const child of children) {
      if (child instanceof Element) {
        const tag = child.tagName.toLowerCase()
        if (tag === 'head') {
          const head = this.head
          if (head) {
            const headChildren = child.nodeStore.getChildNodesArray()
            for (const hc of headChildren) {
              head.appendChild(hc)
            }
          }
        } else if (tag === 'body') {
          const body = this.body
          if (body) {
            const bodyChildren = child.nodeStore.getChildNodesArray()
            for (const bc of bodyChildren) {
              body.appendChild(bc)
            }
          }
        } else if (tag === 'frameset') {
          // <frameset> replaces <body> in the document structure
          const body = this.body
          if (body) {
            this.documentElement.removeChild(body)
          }
          this.documentElement.appendChild(child)
        } else if (headTags.has(tag)) {
          // Metadata elements without an explicit <head> go to <head>
          this.head.appendChild(child)
        } else {
          this.body.appendChild(child)
        }
      }
    }
  }

  writeln(html: string) {
    this.write(html + '\n')
  }

  createRange() {
    return new Range()
  }

  getSelection(): Selection | null {
    return this.defaultView?.getSelection() ?? null
  }

  execCommand(_command: string, _showUI?: boolean, _value?: string): boolean {
    return false
  }

  queryCommandSupported(_command: string): boolean {
    return false
  }

  queryCommandEnabled(_command: string): boolean {
    return false
  }

  createEvent(eventInterface: string): Event {
    const eventConstructors: Record<string, new () => Event> = {
      Event,
      Events: Event,
      HTMLEvents: Event,
      UIEvent,
      UIEvents: UIEvent,
      MouseEvent,
      MouseEvents: MouseEvent,
      KeyboardEvent,
      KeyboardEvents: KeyboardEvent,
      FocusEvent,
      InputEvent,
      CustomEvent,
      ErrorEvent,
      CompositionEvent,
    }
    const Ctor = eventConstructors[eventInterface]
    if (!Ctor) {
      throw new DOMException(
        `The provided event type ("${eventInterface}") is invalid.`,
        'NotSupportedError',
        DOMException.NOT_SUPPORTED_ERR
      )
    }
    return new Ctor()
  }
}

