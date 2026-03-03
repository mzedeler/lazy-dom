import { Future } from "../types/Future"
import { Listener } from "../types/Listener"
import { Listeners, AddEventListenerOptions } from "../types/Listeners"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Text } from "./Text"
import { Comment } from "./Comment"
import { Node } from "./Node/Node"
import { Event } from "./Event"
import { EventTarget } from "../types/EventTarget"
import { PointerEvent } from "./PointerEvent"
import { Attr } from "./Attr"
import { NamedNodeMap } from "./NamedNodeMap"
import { CssSelectAdapter } from "../utils/CssSelectAdapter"
import * as CSSselect from 'css-select'
import * as nodeOps from "../wasm/nodeOps"
import * as NodeRegistry from "../wasm/NodeRegistry"
import { DOMTokenList } from "./DOMTokenList"
import { DOMStringMap } from "./DOMStringMap"
import { DOMException } from "./DOMException"
import { CSSStyleDeclaration } from "./CSSStyleDeclaration"
import { ErrorEvent } from "./ErrorEvent"
import { FocusEvent } from "./FocusEvent"
import { parseHTML } from "../utils/parseHTML"
import { HTMLCollection } from "./HTMLCollection"

const adapter = new CssSelectAdapter()

class ElementStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError('tagName')
  }
  style: Future<CSSStyleDeclaration> = () => new CSSStyleDeclaration()
  attributes: Future<NamedNodeMap> = () => new NamedNodeMap()
  namespaceURI: Future<string | null> = () => null
}

class StyleAwareNamedNodeMap extends NamedNodeMap {
  private _elementStore: ElementStore

  constructor(inner: NamedNodeMap, elementStore: ElementStore) {
    super()
    this._elementStore = elementStore
    // Share the same store so mutations go through
    this.namedNodeMapStore = inner.namedNodeMapStore
  }

  private _getStyleAttr(): Attr | null {
    const style = this._elementStore.style()
    const store = style.cssStyleDeclarationStore
    // If style was set via setAttribute, return the raw attribute value (even if empty string)
    if (store.rawAttributeValue !== null) {
      return new Attr(null, 'style', store.rawAttributeValue)
    }
    // Otherwise return the computed cssText
    const cssText = style.cssText
    if (cssText) {
      return new Attr(null, 'style', cssText)
    }
    // If a CSS property was previously set via JS API, keep the empty style attribute
    if (store.hadProperty) {
      return new Attr(null, 'style', '')
    }
    return null
  }

  get length() {
    return super.length + (this._getStyleAttr() ? 1 : 0)
  }

  item(index: number): Attr | null {
    const baseLength = super.length
    if (index < baseLength) {
      return super.item(index)
    }
    if (index === baseLength && this._getStyleAttr()) {
      return this._getStyleAttr()
    }
    return null
  }

  getNamedItem(name: string): Attr | null {
    if (name === 'style') {
      return this._getStyleAttr()
    }
    return super.getNamedItem(name)
  }

  *[Symbol.iterator]() {
    yield* super[Symbol.iterator]()
    const styleAttr = this._getStyleAttr()
    if (styleAttr) {
      yield styleAttr
    }
  }
}

function parseListenerOptions(options?: boolean | AddEventListenerOptions): { capture: boolean; passive: boolean; once: boolean } {
  if (typeof options === 'boolean') return { capture: options, passive: false, once: false }
  // Reading passive/once from the options object triggers getter-based feature detection
  // (e.g. React checks if the browser supports passive events this way)
  return {
    capture: options?.capture ?? false,
    passive: options?.passive ?? false,
    once: options?.once ?? false,
  }
}

export class Element extends Node implements EventTarget {
  elementStore = new ElementStore()

  // IDL event handler properties — needed so typeof element.onclick === 'function'
  // when a handler is assigned, and 'onclick' in element returns true.
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
  oninput: ((ev: Event) => void) | null = null
  onchange: ((ev: Event) => void) | null = null
  onsubmit: ((ev: Event) => void) | null = null
  onreset: ((ev: Event) => void) | null = null
  onscroll: ((ev: Event) => void) | null = null
  onload: ((ev: Event) => void) | null = null
  onerror: ((ev: Event) => void) | null = null

  constructor() {
    super(NodeTypes.ELEMENT_NODE)
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  get ownerDocument() {
    return this.nodeStore.ownerDocument()
  }

  get tagName() {
    const raw = this.elementStore.tagName()
    // HTML namespace elements always uppercase their tagName
    if (this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml') {
      return raw.toUpperCase()
    }
    return raw
  }

  get nodeName() {
    return this.tagName
  }

  get namespaceURI() {
    return this.elementStore.namespaceURI()
  }

  set namespaceURI(namespaceURI: string | null) {
    this.elementStore.namespaceURI = () => namespaceURI
  }

  /** Internal serialization that doesn't depend on the innerHTML property. */
  private _serializeChildren(): string {
    return this.nodeStore.getChildNodesArray()
      .map((node: Node): string => {
        if (node instanceof Element) return node._serializeOuterHTML()
        if (node instanceof Text) return node.data
        if (node instanceof Comment) return `<!--${node.data}-->`
        return ''
      })
      .join('')
  }

  /** Internal serialization that doesn't depend on outerHTML/innerHTML properties. */
  _serializeOuterHTML(): string {
    const attributes = Array.from(this.attributes)
      .map((attr: Attr) => ' ' + attr.name + '="' + attr.value + '"')
      .join('')

    return '<' + this.tagName.toLocaleLowerCase() + attributes + '>'
      + this._serializeChildren()
      + '</' + this.tagName.toLocaleLowerCase() + '>'
  }

  get innerHTML(): string {
    return this._serializeChildren()
  }

  set innerHTML(html: string) {
    // Properly disconnect old children before clearing
    this._removeAllChildren()

    // Coerce to string - React may pass numbers/booleans via dangerouslySetInnerHTML
    const str = String(html)
    if (str.length) {
      const ownerDocument = this.nodeStore.ownerDocument()
      const nodes = parseHTML(str, ownerDocument)
      for (const node of nodes) {
        nodeOps.setParentId(node.wasmId, this.wasmId)
        nodeOps.appendChild(this.wasmId, node.wasmId)
        ownerDocument.documentStore.connect(node)
      }
    }
  }

  get outerHTML() {
    return this._serializeOuterHTML()
  }

  get style() {
    const result = this.elementStore.style()
    this.elementStore.style = () => result
    return result
  }

  get nodeValue(): null {
    return null
  }

  set nodeValue(_value: string | null) {
    // Setting nodeValue on an Element has no effect per spec
  }

  get textContent(): string {
    const children = this.nodeStore.getChildNodesArray()
    const fragments = []
    for (const child of children) {
      if (child instanceof Element) {
        fragments.push(child.textContent)
      } else if (child instanceof Text) {
        fragments.push(child.data)
      }
    }

    return fragments.join('')
  }

  set textContent(data: string) {
    // Properly disconnect old children before clearing
    this._removeAllChildren()

    if (data.length) {
      const ownerDocument = this.nodeStore.ownerDocument()
      const textNode = ownerDocument.createTextNode(data)
      nodeOps.setParentId(textNode.wasmId, this.wasmId)
      nodeOps.appendChild(this.wasmId, textNode.wasmId)
    }
  }

  get attributes() {
    const result = this.elementStore.attributes()
    this.elementStore.attributes = () => result
    return new StyleAwareNamedNodeMap(result, this.elementStore)
  }

  setAttribute(localName: string, value: string) {
    const name = this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml'
      ? localName.toLowerCase() : localName
    const coercedValue = String(value)
    if (name === 'style') {
      // Force memoization then update cssText
      const style = this.elementStore.style()
      this.elementStore.style = () => style
      // Store the raw attribute value for getAttribute('style') to return
      style.cssStyleDeclarationStore.rawAttributeValue = coercedValue
      style.cssText = coercedValue
      return
    }
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      const attr = new Attr(this, name, coercedValue)
      previousAttributes.setNamedItem(attr)
      return previousAttributes
    }
    return
  }

  /** Internal attribute setter that bypasses any monkey-patching on setAttribute. */
  _setAttributeInternal(name: string, value: string) {
    const normalizedName = this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml'
      ? name.toLowerCase() : name
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      const attr = new Attr(this, normalizedName, String(value))
      previousAttributes.setNamedItem(attr)
      return previousAttributes
    }
  }

  /** Internal attribute remover that bypasses any monkey-patching on removeAttribute. */
  _removeAttributeInternal(name: string) {
    const normalizedName = this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml'
      ? name.toLowerCase() : name
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      previousAttributes.removeNamedItem(normalizedName)
      return previousAttributes
    }
  }

  removeAttribute(qualifiedName: string) {
    const name = this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml'
      ? qualifiedName.toLowerCase() : qualifiedName
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      previousAttributes.removeNamedItem(name)
      return previousAttributes
    }
  }

  private _memoizeListeners(): Listeners {
    const listeners = this.elementStore.eventListeners()
    this.elementStore.eventListeners = () => listeners
    return listeners
  }

  addEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    if (!listener) {
      return
    }
    const { capture, passive, once } = parseListenerOptions(options)
    const listeners = this._memoizeListeners()
    let queue = listeners[type]
    if (!queue) {
      queue = []
      listeners[type] = queue
    }
    queue.push({ listener, capture, passive, once })
  }

  removeEventListener(type: string, listener: unknown, options?: boolean | AddEventListenerOptions) {
    if (!listener) return
    const { capture } = parseListenerOptions(options)
    const listeners = this._memoizeListeners()
    const queue = listeners[type]
    if (queue) {
      const idx = queue.findIndex(
        entry => entry.listener === listener && entry.capture === capture
      )
      if (idx !== -1) {
        queue.splice(idx, 1)
      }
    }
  }

  dispatchEvent(event: Event): boolean {
    // Set the target to this element
    if (event.eventStore) {
      try {
        event.eventStore.target()
      } catch {
        event.eventStore.target = () => this
      }
    }

    const type = event.eventStore ? event.eventStore.type() : event.type

    // Pre-activation behavior for click events on checkbox/radio inputs.
    // Only triggered for MouseEvent/PointerEvent (matching JSDOM behavior),
    // not for plain Event dispatches.
    let savedChecked: boolean | undefined
    if (type === 'click' && (event instanceof MouseEvent || event instanceof PointerEvent)) {
      const inputEl = this._asCheckableInput()
      if (inputEl) {
        savedChecked = inputEl.checked
        const inputType = inputEl.type.toLowerCase()
        const protoSetter = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(this), 'checked'
        )?.set ?? Object.getOwnPropertyDescriptor(
          this.constructor.prototype, 'checked'
        )?.set
        if (protoSetter) {
          if (inputType === 'checkbox') {
            protoSetter.call(this, !savedChecked)
          } else if (inputType === 'radio') {
            protoSetter.call(this, true)
          }
        } else {
          if (inputType === 'checkbox') {
            inputEl.checked = !inputEl.checked
          } else if (inputType === 'radio') {
            inputEl.checked = true
          }
        }
      }
    }

    // Build the event path (target up to root)
    const path: Element[] = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Element | null = this
    while (current) {
      path.push(current)
      const parentId = nodeOps.getParentId(current.wasmId)
      const parent = parentId ? NodeRegistry.getNode(parentId) : undefined
      current = parent instanceof Element ? parent : null
    }

    // Get ownerDocument for event propagation to the document
    let doc: import('./Document').Document | null = null
    try {
      doc = this.ownerDocument
    } catch {
      // No ownerDocument
    }

    // Capture phase: document -> root -> ... -> target parent
    event.eventPhase = 1 // CAPTURING_PHASE
    if (doc && !event.cancelBubble) {
      event.currentTarget = doc as unknown as Node
      doc._fireListeners(type, event, true)
    }
    for (let i = path.length - 1; i > 0; i--) {
      if (event.cancelBubble) break
      event.currentTarget = path[i]
      this._fireListeners(path[i], type, event, true)
    }

    // At-target phase
    if (!event.cancelBubble) {
      event.eventPhase = 2 // AT_TARGET
      event.currentTarget = this
      this._fireListeners(this, type, event, true)
      if (!event.cancelBubble) {
        this._fireListeners(this, type, event, false)
      }
    }

    // Bubble phase: target parent -> ... -> root -> document
    if (event.bubbles && !event.cancelBubble) {
      event.eventPhase = 3 // BUBBLING_PHASE
      for (let i = 1; i < path.length; i++) {
        if (event.cancelBubble) break
        event.currentTarget = path[i]
        this._fireListeners(path[i], type, event, false)
      }
      if (doc && !event.cancelBubble) {
        event.currentTarget = doc as unknown as Node
        doc._fireListeners(type, event, false)
      }
    }

    // Revert checkbox/radio toggle if event was cancelled
    if (savedChecked !== undefined && event.defaultPrevented) {
      const protoSetter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(this), 'checked'
      )?.set ?? Object.getOwnPropertyDescriptor(
        this.constructor.prototype, 'checked'
      )?.set
      if (protoSetter) {
        protoSetter.call(this, savedChecked)
      } else {
        const inputEl = this._asCheckableInput()
        if (inputEl) {
          inputEl.checked = savedChecked
        }
      }
    }

    // Submit button default action: dispatch submit event on the form
    if (type === 'click' && !event.defaultPrevented) {
      if (this.tagName === 'BUTTON' || this.tagName === 'INPUT') {
        const btnType = (this.getAttribute('type') ?? '').toLowerCase()
        if (btnType === 'submit' || (this.tagName === 'BUTTON' && !btnType)) {
          const form = this.closest('form')
          if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
            form.dispatchEvent(submitEvent)
          }
        }
      }
    }

    event.eventPhase = 0 // NONE
    event.currentTarget = null
    return !event.defaultPrevented
  }

  /** Returns this element typed as HTMLInputElement if it's a checkbox or radio, null otherwise. */
  private _asCheckableInput(): { checked: boolean; type: string } | null {
    if (this.tagName === 'INPUT') {
      const inp = this as unknown as { checked: boolean; type: string }
      const t = inp.type?.toLowerCase()
      if (t === 'checkbox' || t === 'radio') return inp
    }
    return null
  }

  private _fireListeners(target: Element, type: string, event: Event, capture: boolean) {
    const listeners = target.elementStore.eventListeners()
    const queue = listeners[type]
    if (queue && queue.length) {
      const snapshot = queue.slice()
      for (const entry of snapshot) {
        if (event._stopImmediatePropagation) break
        if (entry.capture === capture) {
          try {
            entry.listener(event)
          } catch (err) {
            // Browser behavior: errors in event listeners fire ErrorEvent on window
            this._dispatchErrorToWindow(err)
          }
        }
      }
    }
    // Fire the on* property handler (e.g., onclick) during non-capture phase
    if (!capture && !event._stopImmediatePropagation) {
      const handler = (target as unknown as Record<string, unknown>)[`on${type}`]
      if (typeof handler === 'function') {
        try {
          handler.call(target, event)
        } catch (err) {
          this._dispatchErrorToWindow(err)
        }
      }
    }
  }

  /** Disconnect all children from WASM parent tracking and document, then clear. */
  private _removeAllChildren() {
    const childIds = nodeOps.getChildIds(this.wasmId)
    const ownerDocument = this.nodeStore.ownerDocument()
    for (const childId of childIds) {
      nodeOps.setParentId(childId, 0)
      const childNode = NodeRegistry.getNode(childId)
      if (childNode) {
        ownerDocument.documentStore.disconnect(childNode)
      }
    }
    nodeOps.clearChildren(this.wasmId)
  }

  private _dispatchErrorToWindow(err: unknown) {
    try {
      const win = this.ownerDocument?.defaultView
      if (win) {
        const errObj = err as { message?: string }
        const message = (typeof errObj?.message === 'string') ? errObj.message : String(err)
        const errorEvent = new ErrorEvent('error', {
          message,
          error: err,
          cancelable: true,
        })
        const handled = !win.dispatchEvent(errorEvent)
        // If the error event was not preventDefault()'d, log to console.error
        // like browsers do for uncaught errors in event handlers
        if (!handled) {
          win.console.error(`Error: Uncaught [${err}]`, err)
        }
      }
    } catch {
      // If window dispatch fails, silently swallow
    }
  }

  click() {
    const event = new PointerEvent('click', { bubbles: true, cancelable: true })
    this.dispatchEvent(event)
  }

  get hidden(): boolean {
    return this.hasAttribute('hidden')
  }

  hasAttribute(name: string): boolean {
    const normalizedName = this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml'
      ? name.toLowerCase() : name
    return this.attributes.getNamedItem(normalizedName) !== null
  }

  getAttributeNames(): string[] {
    return Object.keys(this.attributes.namedNodeMapStore.itemsLookup())
  }

  getAttribute(qualifiedName: string) {
    const name = this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml'
      ? qualifiedName.toLowerCase() : qualifiedName
    if (name === 'style') {
      const style = this.elementStore.style()
      const store = style.cssStyleDeclarationStore
      // Return raw attribute value if style was set via setAttribute (even if empty string)
      if (store.rawAttributeValue !== null) return store.rawAttributeValue
      // Otherwise return computed cssText
      const cssText = style.cssText
      if (cssText) return cssText
      // If a CSS property was previously set via JS API, return empty string
      if (store.hadProperty) return ''
      return null
    }
    return this.attributes.getNamedItem(name)?.value ?? null
  }

  getAttributeNode(qualifiedName: string): Attr | null {
    const name = this.elementStore.namespaceURI() === 'http://www.w3.org/1999/xhtml'
      ? qualifiedName.toLowerCase() : qualifiedName
    return this.attributes.getNamedItem(name) ?? null
  }

  setAttributeNode(attr: Attr): Attr | null {
    // INUSE_ATTRIBUTE_ERR: attr is already owned by a different element
    if (attr.ownerElement !== null && attr.ownerElement !== this) {
      throw new DOMException(
        "The attribute is already in use by another element.",
        'InUseAttributeError',
        DOMException.INUSE_ATTRIBUTE_ERR
      )
    }

    const previousAttributesFuture = this.elementStore.attributes
    let oldAttr: Attr | null = null
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      oldAttr = previousAttributes.setNamedItem(attr)
      attr.ownerElement = this
      return previousAttributes
    }
    // Force evaluation to get the old attr
    this.elementStore.attributes()
    return oldAttr
  }

  removeAttributeNode(attr: Attr): Attr {
    const current = this.attributes.getNamedItem(attr.name)
    if (current !== attr) {
      throw new DOMException(
        "The attribute is not found on this element.",
        'NotFoundError',
        DOMException.NOT_FOUND_ERR
      )
    }
    this.removeAttribute(attr.name)
    attr.ownerElement = null
    return attr
  }

  hasAttributes(): boolean {
    return this.attributes.length > 0
  }

  get localName(): string {
    const tagName = this.elementStore.tagName()
    const colonIndex = tagName.indexOf(':')
    if (colonIndex >= 0) {
      return tagName.substring(colonIndex + 1)
    }
    return tagName
  }

  get prefix(): string | null {
    const tagName = this.elementStore.tagName()
    const colonIndex = tagName.indexOf(':')
    if (colonIndex >= 0) {
      return tagName.substring(0, colonIndex)
    }
    return null
  }

  setAttributeNS(namespaceURI: string | null, qualifiedName: string, value: string) {
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

    const coercedValue = String(value)
    const attr = new Attr(this, localName, coercedValue, namespaceURI, prefix)
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      previousAttributes.setNamedItemNS(attr)
      return previousAttributes
    }
  }

  getAttributeNS(namespaceURI: string | null, localName: string): string | null {
    const attr = this.attributes.getNamedItemNS(namespaceURI, localName)
    return attr ? attr.value : null
  }

  getAttributeNodeNS(namespaceURI: string | null, localName: string): Attr | null {
    return this.attributes.getNamedItemNS(namespaceURI, localName)
  }

  removeAttributeNS(namespaceURI: string | null, localName: string) {
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      previousAttributes.removeNamedItemNS(namespaceURI, localName)
      return previousAttributes
    }
  }

  hasAttributeNS(namespaceURI: string | null, localName: string): boolean {
    return this.attributes.getNamedItemNS(namespaceURI, localName) !== null
  }

  setAttributeNodeNS(attr: Attr): Attr | null {
    if (attr.ownerElement !== null && attr.ownerElement !== this) {
      throw new DOMException(
        "The attribute is already in use by another element.",
        'InUseAttributeError',
        DOMException.INUSE_ATTRIBUTE_ERR
      )
    }

    const previousAttributesFuture = this.elementStore.attributes
    let oldAttr: Attr | null = null
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      oldAttr = previousAttributes.setNamedItemNS(attr)
      attr.ownerElement = this
      return previousAttributes
    }
    this.elementStore.attributes()
    return oldAttr
  }

  getElementsByTagNameNS(namespaceURI: string | null, localName: string): Element[] {
    const matchAllNS = namespaceURI === '*'
    const matchAllName = localName === '*'
    const results: Element[] = []

    const walk = (node: Node) => {
      const children = node.childNodes
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child instanceof Element) {
          const nsMatch = matchAllNS || child.namespaceURI === namespaceURI
          const nameMatch = matchAllName || child.localName === localName
          if (nsMatch && nameMatch) {
            results.push(child)
          }
          walk(child)
        }
      }
    }

    walk(this)
    return results
  }

  getElementsByTagName(tagName: string): Element[] {
    const upperName = tagName.toUpperCase()
    const matchAll = tagName === '*'
    const results: Element[] = []

    const walk = (node: Node) => {
      const children = node.childNodes
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child instanceof Element) {
          // HTML elements have uppercased tagNames, SVG elements preserve case
          if (matchAll || child.tagName === upperName || child.tagName === tagName) {
            results.push(child)
          }
          walk(child)
        }
      }
    }

    walk(this)
    return results
  }

  querySelectorAll(query: string): Element[] {
    try {
      return CSSselect.selectAll(query, this, { adapter }).filter(
        (node): node is Element => node instanceof Element
      )
    } catch {
      return []
    }
  }

  matches(selectors: string): boolean {
    try {
      return CSSselect.is(this, selectors, { adapter })
    } catch {
      return false
    }
  }

  querySelector(selectors: string): Element | null {
    try {
      const result = CSSselect.selectOne(selectors, this, { adapter })
      return result instanceof Element ? result : null
    } catch {
      return null
    }
  }

  append(...nodes: (Node | string)[]) {
    for (const node of nodes) {
      if (typeof node === 'string') {
        this.appendChild(this.ownerDocument.createTextNode(node))
      } else {
        this.appendChild(node)
      }
    }
  }

  prepend(...nodes: (Node | string)[]) {
    const firstChild = this.firstChild
    for (const node of nodes) {
      const child = typeof node === 'string'
        ? this.ownerDocument.createTextNode(node)
        : node
      this.insertBefore(child, firstChild)
    }
  }

  after(...nodes: (Node | string)[]) {
    const parent = this.parentNode
    if (!parent) return
    const nextSib = this.nextSibling
    for (const node of nodes) {
      const child = typeof node === 'string'
        ? this.ownerDocument.createTextNode(node)
        : node
      parent.insertBefore(child, nextSib)
    }
  }

  before(...nodes: (Node | string)[]) {
    const parent = this.parentNode
    if (!parent) return
    for (const node of nodes) {
      const child = typeof node === 'string'
        ? this.ownerDocument.createTextNode(node)
        : node
      parent.insertBefore(child, this)
    }
  }

  replaceWith(...nodes: (Node | string)[]) {
    const parent = this.parentNode
    if (!parent) return
    const nextSib = this.nextSibling
    parent.removeChild(this)
    for (const node of nodes) {
      const child = typeof node === 'string'
        ? this.ownerDocument.createTextNode(node)
        : node
      parent.insertBefore(child, nextSib)
    }
  }

  get clientWidth(): number { return 0 }
  get clientHeight(): number { return 0 }
  get scrollWidth(): number { return 0 }
  get scrollHeight(): number { return 0 }

  get scrollTop(): number { return 0 }
  set scrollTop(_value: number) {}
  get scrollLeft(): number { return 0 }
  set scrollLeft(_value: number) {}

  getBoundingClientRect() {
    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }
  }

  getClientRects() {
    return []
  }

  focus() {
    const doc = this.ownerDocument
    const previousActive = doc.documentStore.activeElement()
    if (previousActive === this) return
    doc.documentStore.activeElement = () => this
    // Dispatch focus events (focusin bubbles, focus does not)
    const focusIn = new FocusEvent('focusin', { bubbles: true, relatedTarget: previousActive })
    this.dispatchEvent(focusIn)
    const focusEvt = new FocusEvent('focus', { bubbles: false, relatedTarget: previousActive })
    this.dispatchEvent(focusEvt)
  }

  blur() {
    const doc = this.ownerDocument
    if (doc.documentStore.activeElement() === this) {
      doc.documentStore.activeElement = () => null
      // Dispatch blur events (focusout bubbles, blur does not)
      const focusOut = new FocusEvent('focusout', { bubbles: true, relatedTarget: null })
      this.dispatchEvent(focusOut)
      const blurEvt = new FocusEvent('blur', { bubbles: false, relatedTarget: null })
      this.dispatchEvent(blurEvt)
    }
  }

  closest(selectors: string): Element | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Element | null = this
    while (current) {
      if (current.matches(selectors)) return current
      current = current.parentElement
    }
    return null
  }

  get classList() {
    return new DOMTokenList(this.elementStore)
  }

  get dataset() {
    return new DOMStringMap(this.elementStore)
  }

  get children(): HTMLCollection {
    const elements = this.nodeStore.getChildNodesArray().filter(node => node instanceof Element)
    return new HTMLCollection(elements)
  }

  get firstElementChild(): Element | null {
    const children = this.nodeStore.getChildNodesArray()
    for (const child of children) {
      if (child instanceof Element) return child
    }
    return null
  }

  get lastElementChild(): Element | null {
    const children = this.nodeStore.getChildNodesArray()
    for (let i = children.length - 1; i >= 0; i--) {
      if (children[i] instanceof Element) return children[i] as Element
    }
    return null
  }

  get childElementCount(): number {
    return this.children.length
  }

  insertAdjacentElement(position: string, element: Element): Element | null {
    switch (position.toLowerCase()) {
      case 'beforebegin': {
        const parent = this.parentNode
        if (!parent) return null
        parent.insertBefore(element, this)
        return element
      }
      case 'afterbegin':
        this.insertBefore(element, this.firstChild)
        return element
      case 'beforeend':
        this.appendChild(element)
        return element
      case 'afterend': {
        const parent = this.parentNode
        if (!parent) return null
        parent.insertBefore(element, this.nextSibling)
        return element
      }
      default:
        return null
    }
  }

  insertAdjacentHTML(position: string, text: string) {
    // Minimal implementation: creates a text node with the HTML string
    const textNode = this.ownerDocument.createTextNode(text)
    switch (position.toLowerCase()) {
      case 'beforebegin': {
        const parent = this.parentNode
        if (parent) parent.insertBefore(textNode, this)
        break
      }
      case 'afterbegin':
        this.insertBefore(textNode, this.firstChild)
        break
      case 'beforeend':
        this.appendChild(textNode)
        break
      case 'afterend': {
        const parent = this.parentNode
        if (parent) parent.insertBefore(textNode, this.nextSibling)
        break
      }
    }
  }

  protected _cloneNodeShallow(): Element {
    const tagName = this.elementStore.tagName()
    const ns = this.elementStore.namespaceURI()
    const clone = ns
      ? this.ownerDocument.createElementNS(ns, tagName)
      : this.ownerDocument.createElement(tagName)
    // Copy attributes preserving namespace info
    for (const attr of this.attributes) {
      if (attr.namespaceURI) {
        clone.setAttributeNS(attr.namespaceURI, attr.name, attr.value)
      } else {
        clone.setAttribute(attr.name, attr.value)
      }
    }
    return clone
  }
}
