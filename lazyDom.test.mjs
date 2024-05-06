
import { expect } from 'chai'
import lazyDom from './lazyDom.mjs'

describe('main', () => {
  it('initializes correctly', async () => {
    lazyDom()

    expect(document).to.exist;
  })
})
