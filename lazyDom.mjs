const lazyDom = () => {
  globalThis.document = {
    body: {}
  }
  global.document = {
    body: {}
  }
}

export default lazyDom
