const ELEMENT_NODE =  1
const TEXT_NODE = 3
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_FRAGMENT_NODE = 11

class Text {}

class Element {
  nodeType = ELEMENT_NODE
  tagName = null
  ownerDocument = null

  get outerHTML() {
    return ''
  }

  matches() {
    return false
  }
  get childNodes() {
    return []
  }
  querySelector(x) {
    return new Element()
  }
  querySelectorAll(x) {
    return []
  }
  appendChild(node) {
    return
  }
  addEventListener(type, listener) {
    return
  }
}

class Document extends Element {
  body = new Element()

  createElement(localName) {
    const element = new Element()
    element.ownerDocument = this
    element.tagName = localName
    const revocable = Proxy.revocable(element, {
      get(target, property) {
        return Reflect.get(target, property)
      }
    })

    return revocable.proxy
  }
  createTextNode(data) {
    return new Text()
  }
}

class Window {}

class HTMLIFrameElement {}

const lazyDom = () => {
  const document = new Document()
  const window = new Window()
  const instances = { document, window }
  const classes = { HTMLIFrameElement }
  Object.assign(global, instances, classes)
  Object.assign(window, global)
}

export default lazyDom
