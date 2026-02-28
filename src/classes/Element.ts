import { Future } from "../types/Future"
import { Listeners } from "../types/Listeners"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Text } from "./Text"
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

const adapter = new CssSelectAdapter()

class ElementStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError('tagName')
  }
  style: Future<Record<string, unknown>> = () => ({})
  attributes: Future<NamedNodeMap> = () => new NamedNodeMap()
  namespaceURI: Future<string | null> = () => null
}

const isEventTarget = (node: unknown): node is EventTarget =>
  Boolean(node && (node as EventTarget).addEventListener && (node as EventTarget).dispatchEvent)

export class Element extends Node implements EventTarget {
  elementStore = new ElementStore()

  constructor() {
    super(NodeTypes.ELEMENT_NODE)
  }

  get ownerDocument() {
    return this.nodeStore.ownerDocument()
  }

  get tagName() {
    return this.elementStore.tagName().toUpperCase()
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

  get innerHTML(): string {
    return this.nodeStore.getChildNodesArray()
      .map((node: Node): string => {
        if (node instanceof Element) return node.outerHTML
        if (node instanceof Text) return node.data
        return ''
      })
      .join('')
  }

  get outerHTML() {
    const attributes = Object
      .values(this.elementStore.attributes().namedNodeMapStore.itemsLookup())
      .map((attr: Attr) => ' ' + attr.localName + '="' + attr.value + '"')
      .join('')

    return '<' + this.tagName.toLocaleLowerCase() + attributes + '>'
      + this.innerHTML
      + '</' + this.tagName.toLocaleLowerCase() + '>'
  }

  get style() {
    return this.elementStore.style()
  }

  get nodeValue(): null {
    return null
  }

  set nodeValue(_value: any) {
    // Setting nodeValue on an Element has no effect per spec
  }

  get textContent(): string {
    const children = this.nodeStore.getChildNodesArray()
    const fragments = []
    for (const value of children) {
      if (value instanceof Text) {
        fragments.push(value.nodeValue)
      }
    }

    return fragments.join('')
  }

  set textContent(data: string) {
    // Clear all existing children from WASM
    nodeOps.clearChildren(this.wasmId)

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
    return result
  }

  setAttribute(localName: string, value: string) {
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      const attr = new Attr(this, localName, value)
      previousAttributes.setNamedItem(attr)
      return previousAttributes
    }
    return
  }

  removeAttribute(qualifiedName: string) {
    const previousAttributesFuture = this.elementStore.attributes
    this.elementStore.attributes = () => {
      const previousAttributes: NamedNodeMap = previousAttributesFuture()
      previousAttributes.removeNamedItem(qualifiedName)
      return previousAttributes
    }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeEventListener(type: string, listener: unknown) {
    // Stub: event listener removal not fully implemented
  }

  dispatchEvent(event: Event) {
    const listeners = this.elementStore.eventListeners()
    const queue = listeners[event.type]
    if (queue && queue.length) {
      queue.forEach(listener => listener(event))
    } else {
      const parentId = nodeOps.getParentId(this.wasmId)
      const parent = parentId ? NodeRegistry.getNode(parentId) : undefined
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

  get hidden(): boolean {
    return this.hasAttribute('hidden')
  }

  hasAttribute(name: string): boolean {
    return this.attributes.getNamedItem(name) !== null
  }

  getAttributeNames(): string[] {
    return Object.keys(this.attributes.namedNodeMapStore.itemsLookup())
  }

  getAttribute(qualifiedName: string) {
    return this.attributes.getNamedItem(qualifiedName)?.value ?? null
  }

  getAttributeNode(qualifiedName: string): Attr | null {
    return this.attributes.getNamedItem(qualifiedName) ?? null
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

    const attr = new Attr(this, localName, value, namespaceURI, prefix)
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
          if (matchAll || child.tagName === upperName) {
            results.push(child)
          }
          walk(child)
        }
      }
    }

    walk(this)
    return results
  }

  querySelectorAll(query: string) {
    return CSSselect.selectAll(query, this, { adapter })
  }

  matches(selectors: string): boolean {
    return CSSselect.is(this, selectors, { adapter })
  }

  querySelector(selectors: string): Element | null {
    return CSSselect.selectOne(selectors, this, { adapter })
  }

  focus() {}

  blur() {}

  closest(selectors: string): Element | null {
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

  get children() {
    return this.nodeStore.getChildNodesArray().filter(node => node instanceof Element)
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
