import lazyDom from '../lazyDom'

import { suite } from './suite'

// @ts-expect-error
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('react with lazyDom', () => {
  beforeEach(lazyDom)

  suite()
})
