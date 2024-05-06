
class Element {
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
}

class Document extends Element {
  body = new Element()
}

const lazyDom = () => {
  global.document = new Document()
}

export default lazyDom
