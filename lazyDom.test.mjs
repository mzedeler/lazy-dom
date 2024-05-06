
import { expect } from 'chai'
import lazyDom from './lazyDom.mjs'

describe('main', () => {
  it('initializes correctly', async () => {
    lazyDom()

    expect(document).to.exist
  })

  it('supports screen.queryByText() with empty DOM', async () => {
    lazyDom()
    const { screen } = await import('@testing-library/dom')

    expect(screen.queryByText('hello')).to.be.null
  })
})
