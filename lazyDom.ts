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
  store = new NodeStore()

  get nodeType(): NodeTypes {
    return this.store.nodeType()
  }

  get ownerDocument(): Document {
    return this.store.ownerDocument()
  }

  get parent(): Node {
    return this.store.parent()
  }

  get parentNode(): Node {
    return this.store.parent()
  }
}

type Future<T> = () => T

const valueNotSetError = (property?: string) => new Error('value not set: ' + (property || ''))

class TextStore extends NodeStore {
  data: Future<string> = () => {
    throw valueNotSetError('data')
  }
}

class Text extends Node {
  store = new TextStore()
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
  store = new EventStore()

  get target(): Node {
    return this.store.target()
  }

  get type(): EventType {
    return this.store.type()
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

class ElementStore extends NodeStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError('tagName')
  }
  childNodes: Future<Array<Node>> = () => []
}

const isEventTarget = (node: unknown): node is EventTarget =>
  Boolean((node as EventTarget).addEventListener && (node as EventTarget).dispatchEvent)

class Element extends Node implements EventTarget {
  store = new ElementStore()

  constructor() {
    super()
    this.store.nodeType = () => NodeTypes.ELEMENT_NODE
  }

  get ownerDocument() {
    return this.store.ownerDocument()
  }

  get tagName() {
    return this.store.tagName()
  }

  get outerHTML() {
    return ''
  }

  get childNodes() {
    return this.store.childNodes()
  }

  appendChild(node: Node) {
    const previousChildNodes = this.store.childNodes()
    node.store.parent = () => this
    this.store.childNodes = () => {
      previousChildNodes.push(node)

      return previousChildNodes
    }
  }

  addEventListener: EventTarget['addEventListener'] = (type, listener) => {
    const previousEventListeners = this.store.eventListeners()
    this.store.eventListeners = () => {
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
    const listeners = this.store.eventListeners()
    const queue = listeners[event.type]
    if (queue && queue.length) {
      queue.forEach(listener => listener(event))
    } else {
      const parent = this.store.parent()
      if (isEventTarget(parent)) {
        parent.dispatchEvent(event)
      }
    }
  }

  click() {
    const event = new PointerEvent()
    event.store.type = () => 'click'
    event.store.target = () => this
    this.dispatchEvent(event)
  }

  matches() {
    return false
  }

  querySelector(query: string) {
    return new Element()
  }

  querySelectorAll(query: string) {
    return []
  }
}

class DocumentStore extends ElementStore {
  body: Future<Element> = () => {
    throw valueNotSetError('body')
  }
}

class BodyStore extends ElementStore {

}

class Body extends Element {
  store = new BodyStore()

  constructor() {
    super()

    this.store.tagName = () => 'body'
  }
}

class Document extends Element {
  store = new DocumentStore()

  get body(): Element {
    return this.store.body()
  }

  constructor() {
    super()
    this.store.nodeType = () => NodeTypes.DOCUMENT_NODE
    this.store.body = () => {
      const body = new Body()
      body.store.ownerDocument = () => this
      return body
    }
  }

  createElement(localName: string): Element {
    const element = new Element()
    element.store.tagName = () => localName
    element.store.ownerDocument = () => this
    return element
  }

  createTextNode(data: string): Text {
    const textNode = new Text()
    textNode.store.ownerDocument = () => this
    textNode.store.data = () => data

    return textNode
  }
}

class Window {
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
