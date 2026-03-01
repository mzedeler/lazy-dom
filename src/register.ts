import lazyDom from './lazyDom'

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean
  // eslint-disable-next-line no-var
  var __LAZY_DOM__: boolean
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.__LAZY_DOM__ = true

lazyDom()
