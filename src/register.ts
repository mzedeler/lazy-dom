import lazyDom from './lazyDom'

;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
;(global as any).IS_REACT_ACT_ENVIRONMENT = true

lazyDom()
