// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy

enum NodeTypes {
  ELEMENT_NODE =  1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_FRAGMENT_NODE = 11
}

class NodeStore {
  nodeType: Future<NodeTypes> = () => {
    throw valueNotSetError('nodeType')
  }
  ownerDocument: Future<Document> = () => {
    throw valueNotSetError('ownerDocument')
  }
  parent: Future<Node> = () => {
    throw valueNotSetError('parent')
  }
}

class Node {
  nodeStore = new NodeStore()

  get nodeType(): NodeTypes {
    return this.nodeStore.nodeType()
  }

  get ownerDocument(): Document {
    return this.nodeStore.ownerDocument()
  }

  get parent(): Node {
    return this.nodeStore.parent()
  }

  get parentNode(): Node {
    return this.nodeStore.parent()
  }
}

type Future<T> = () => T

const valueNotSetError = (property?: string) => new Error('value not set: ' + (property || ''))

class TextStore  {
  data: Future<string> = () => {
    throw valueNotSetError('data')
  }
}

class Text extends Node {
  textStore = new TextStore()

  constructor() {
    super()

    this.nodeStore.nodeType = () => NodeTypes.TEXT_NODE
  }

  get data() {
    return this.textStore.data()
  }

  set data(data: string) {
    this.textStore.data = () => data
  }
}

type EventType = 'click'

class EventStore {
  type: Future<EventType> = () => {
    throw valueNotSetError('type')
  }
  target: Future<Node> = () => {
    throw valueNotSetError('target')
  }
}

class Event {
  eventStore = new EventStore()

  get target(): Node {
    return this.eventStore.target()
  }

  get type(): EventType {
    return this.eventStore.type()
  }
}

class UIEvent extends Event {}
class MouseEvent extends UIEvent {}
class PointerEvent extends MouseEvent {}
class EventTarget {}

type Listener = (event: Event) => any
type Listeners =  Record<string, Listener[]>

interface EventTarget {
  addEventListener: (type: string, listener: Listener) => void
  dispatchEvent: (event: Event) => void
}

class ElementStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError('tagName')
  }
  childNodes: Future<Array<Node>> = () => []
  style: Future<Record<string, unknown>> = () => ({})
}

const isEventTarget = (node: unknown): node is EventTarget =>
  Boolean((node as EventTarget).addEventListener && (node as EventTarget).dispatchEvent)


class Element extends Node implements EventTarget {
  elementStore = new ElementStore()

  constructor() {
    super()
    this.nodeStore.nodeType = () => NodeTypes.ELEMENT_NODE
  }

  get ownerDocument() {
    return this.nodeStore.ownerDocument()
  }

  get tagName() {
    return this.elementStore.tagName().toUpperCase()
  }

  get outerHTML() {
    return ''
  }

  get childNodes() {
    return this.elementStore.childNodes()
  }

  get style() {
    return this.elementStore.style()
  }

  setAttribute() {
    return
  }

  appendChild(node: Node) {
    const previousChildNodes = this.elementStore.childNodes()
    node.nodeStore.parent = () => this
    this.elementStore.childNodes = () => {
      previousChildNodes.push(node)

      return previousChildNodes
    }
  }

  addEventListener: EventTarget['addEventListener'] = (type, listener) => {
    const previousEventListeners = this.elementStore.eventListeners()
    this.elementStore.eventListeners = () => {
      let queue = previousEventListeners[type]
      if (!queue) {
        queue = []
      }
      queue.push(listener)
      previousEventListeners[type] = queue

      return previousEventListeners
    }
  }

  dispatchEvent(event: Event) {
    const listeners = this.elementStore.eventListeners()
    const queue = listeners[event.type]
    if (queue && queue.length) {
      queue.forEach(listener => listener(event))
    } else {
      const parent = this.nodeStore.parent()
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

  matches() {
    return false
  }

  querySelector(query: string) {
    return new Element()
  }

  querySelectorAll(query: string) {
    return this.ownerDocument.all
  }
}


class BodyStore  {
}

class Body extends Element {
  bodyStore = new BodyStore()

  constructor() {
    super()
    this.elementStore.tagName = () => 'body'
  }
}

class LookupStore {
  elements: Future<Element[]> = () => []
}

class DocumentStore  {
  nodeType = () => NodeTypes.DOCUMENT_NODE

  body: Future<Element> = () => {
    throw valueNotSetError('body')
  }
}

class Document {
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
    return this.lookupStore.elements()
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

const lazyDom = () => {
  const window = new Window()
  const document = new Document()
  // document.defaultView = window
  const navigator = new Navigator()
  const instances = { document, window, navigator }
  const classes = { HTMLIFrameElement, EventTarget }
  Object.assign(window, instances, classes)
  Object.assign(global, { window, document })
}

export default lazyDom
