enum NodeTypes {
  ELEMENT_NODE =  1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_FRAGMENT_NODE = 11
}

class NodeStore {
  nodeType: Future<NodeTypes> = () => {
    throw valueNotSetError()
  }
  ownerDocument: Future<Document> = () => {
    throw valueNotSetError()
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
}

type Future<T> = () => T

const valueNotSetError = () => new Error('value not set')

class TextStore extends NodeStore {
  data: Future<string> = () => {
    throw valueNotSetError()
  }
}

class Text extends Node {
  store = new TextStore()
}

class Event {
  target = undefined
}

class UIEvent extends Event {}
class MouseEvent extends UIEvent {}
class PointerEvent extends MouseEvent {}
class EventTarget {}

type Listener = (event: Event) => any
type Listeners =  Record<string, Listener[]>

interface EventTarget {
  addEventListener: (type: string, listener: Listener) => void
}

class ElementStore extends NodeStore {
  eventListeners: Future<Listeners> = () => ({})
  tagName: Future<string> = () => {
    throw valueNotSetError()
  }
  childNodes: Future<Array<typeof Node>> = () => []
}

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

  appendChild(node: typeof Node) {
    const previousChildNodes = this.store.childNodes()
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
    return
  }

  click() {
    const event = new PointerEvent()
    // event.target = this
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
    throw valueNotSetError()
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
