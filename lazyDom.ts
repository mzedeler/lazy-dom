import { Command } from './src/Command'
import { addObject } from './src/commands/addObject'
import { setValue } from './src/commands/setValue'
import { reducer } from './src/reducer'

const ELEMENT_NODE =  1
const TEXT_NODE = 3
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_FRAGMENT_NODE = 11

let state = reducer()
const dispatch = (command: Command) => {
  state = reducer(state, command)
}

const getValue = (object: Object, property: string) => state.values.get(object)?.[property]

class Node {}

class Text extends Node {}

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

type Listener = (event: Event) => any
type Listeners =  Record<string, Listener[]>

interface EventTarget {
  addEventListener: (type: string, listener: Listener) => void
}

class Element extends Node implements EventTarget {
  constructor() {
    super()
    dispatch({ 'type': 'addObject', object: this })
    dispatch({ 'type': 'setValue', object: this, property: '#listeners', value: {} })
    dispatch({ 'type': 'setValue', object: this, property: 'nodeType', value: ELEMENT_NODE })
  }

  get outerHTML() {
    return ''
  }

  matches() {
    return false
  }

  get childNodes() {
    return []
  }

  querySelector(query: string) {
    return new Element()
  }

  querySelectorAll(query: string) {
    return []
  }

  appendChild(node: Node) {
    // https://dom.spec.whatwg.org/#concept-node-append
    dispatch({ 'type': 'setValue', object: node, property: 'parent', value: this })

    const ownerDocument = getValue(this, 'ownerDocument') ?? this
    dispatch({ 'type': 'setValue', object: node, property: 'ownerDocument', value: ownerDocument })

    const children = getValue(this, 'children') as Array<any>
    dispatch({ 'type': 'pushValue', object: children, value: node })

    return node
  }

  addEventListener: EventTarget['addEventListener'] = (type, listener) => {
    const listeners = getValue(this, '#listeners') as Listeners
    let queue = getValue(listeners, type) as Listener[]
    if (!queue) {
      dispatch({ 'type': 'addObject', object: queue, })
    }
    dispatch({ 'type': 'pushValue', object: queue, 'value': listener })

    return
  }

  dispatchEvent(event: Event) {
    // if (this.#listeners.length) {
    //   console.log(this.tagName, ': click dispatched')
    //   this.#listeners.forEach(listener => listener(event))
    // } else {
    //   console.log(this.tagName, ': click bubbling')
    //   if (this.parent) {
    //     this.parent.dispatchEvent(event)
    //   }
    // }
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
    // event.target = this
    this.dispatchEvent(event)
  }
}

const USE_PROXY = false

class Document extends Element {
  get body(): Element {
    return getValue(this, 'body') as Element
  }

  constructor() {
    super()
    dispatch({ type: 'addObject', object: this })
    dispatch({ type: 'setValue', object: this, property: 'nodeType', value: DOCUMENT_NODE })

    const body = new Element()
    dispatch({ type: 'addObject', object: body })
    dispatch({ type: 'setValue', object: body, property: 'tagName', value: 'body' })
    dispatch({ type: 'setValue', object: body, property: 'ownerDocument', value: this })
  }

  createElement(localName: string) {
    const element = new Element()
    dispatch({ type: 'addObject', object: element })
    dispatch({ type: 'setValue', object: element, property: 'ownerDocument', value: this })
    dispatch({ type: 'setValue', object: element, property: 'tagName', value: localName })
    return element
  }

  createTextNode(data: string) {
    const textNode = new Text()
    dispatch({ type: 'addObject', object: textNode })
    dispatch({ type: 'setValue', object: textNode, property: 'ownerDocument', value: this })
    dispatch({ type: 'setValue', object: textNode, property: 'data', value: data })
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
