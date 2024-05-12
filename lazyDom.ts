import { addObject } from './src/commands/addObject'
import { setValue } from './src/commands/setValue'
import { reducer } from './src/reducer'

const ELEMENT_NODE =  1
const TEXT_NODE = 3
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_FRAGMENT_NODE = 11

let state = reducer()
const dispatch = command => {
  state = reducer(command)
}

const getValue = (object, property) => state.values.get(object)?.[property]

class Text {}

class Event {
  target = undefined
}
class UIEvent extends Event {}
class MouseEvent extends UIEvent {}
class PointerEvent extends MouseEvent {}
class EventTarget {
  constructor() {
    dispatch(addObject(this))
  }
}

class Element {
  nodeType = ELEMENT_NODE
  tagName = null
  ownerDocument = null

  #children = []
  #listeners = []

  constructor() {
    dispatch(addObject(this))
    dispatch(setValue, 'eventTarget', new EventTarget())
  }

  get outerHTML() {
    return ''
  }

  matches() {
    return false
  }

  get childNodes() {
    return this.#children
  }

  querySelector(x) {
    return new Element()
  }

  querySelectorAll(x) {
    return []
  }

  appendChild(node) {
    // https://dom.spec.whatwg.org/#concept-node-append
    console.log(this.tagName, '.appendChild(', node.tagName, ')')
    node.parent = this
    node.ownerDocument = this instanceof Document ? this : this.ownerDocument
    this.#children.push(node)
    return node
  }

  addEventListener(type, listener) {
    const eventTarget = getValue(this, 'eventTarget')
    eventTarget.addEventListener()
    if (type === 'click') {
      this.#listeners.push(listener)
    }

    return
  }

  dispatchEvent(event) {
    if (this.#listeners.length) {
      console.log(this.tagName, ': click dispatched')
      this.#listeners.forEach(listener => listener(event))
    } else {
      console.log(this.tagName, ': click bubbling')
      if (this.parent) {
        this.parent.dispatchEvent(event)
      }
    }
    return
  }

  click() {
    // https://html.spec.whatwg.org/multipage/interaction.html#dom-click-dev
    //  1. If this element is a form control that is disabled, return
    //  2. If this elements click in progress flag is set, return
    //  3. Set this elements click in progress flag
    //  4. Fire a synthetic pointer event named "click" at this element, with the not trusted flag set
    //  5. Unset this elements click in progress flag
    const event = new PointerEvent()
    event.target = this
    this.dispatchEvent(event)
  }
}

const USE_PROXY = false

class Document extends Element {
  body = new Element()
  defaultView = undefined

  constructor() {
    super()
    this.nodeType = DOCUMENT_NODE
    this.body.tagName = 'body'
    this.body.ownerDocument = this
  }

  createElement(localName) {
    const element = new Element()
    dispatch(setValue(element, 'ownerDocument', this))
    dispatch(setValue(element, 'tagName', localName))
    element.ownerDocument = this
    element.tagName = localName
    return element
  }

  createTextNode(data) {
    return new Text()
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
  document.defaultView = window
  const navigator = new Navigator()
  const instances = { document, window, navigator }
  const classes = { HTMLIFrameElement, EventTarget }
  Object.assign(window, instances, classes)
  Object.assign(global, { window, document })
}

export default lazyDom