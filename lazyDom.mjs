const ELEMENT_NODE =  1
const TEXT_NODE = 3
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_FRAGMENT_NODE = 11

class Text {}

class Element {
  nodeType = ELEMENT_NODE
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
    return element
  }
  createTextNode(data) {
    return new Text()
  }
}

const lazyDom = () => {
  global.document = new Document()
}

export default lazyDom
