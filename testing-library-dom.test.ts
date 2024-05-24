// import { screen } from '@testing-library/dom'
import { expect } from 'chai'

describe.skip('@testing-library/dom', () => {
  it('supports screen.queryByText() with empty DOM', async () => {
    expect(screen.queryByText('hello')).to.be.null
  })

  it('supports screen.queryByText() with non-empty DOM', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    expect(screen.queryByText('hello')).to.be.null
  })

  it('supports screen.queryByText() where it finds a node', async () => {
    const div = document.createElement('div')
    const textNode = document.createTextNode('hello')
    div.appendChild(textNode)
    document.body.appendChild(div)

    expect(screen.queryByText('hello')).to.eq(div)
  })
})
