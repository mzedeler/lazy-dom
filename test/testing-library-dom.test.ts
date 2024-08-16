import { screen } from '@testing-library/dom'
import { expect } from 'chai'

describe('@testing-library/dom', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  xit('supports screen.queryByText() with empty DOM', async () => {
    expect(screen.queryByText('hello')).to.be.null
  })

  xit('supports screen.queryByText() with non-empty DOM', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    expect(screen.queryByText('hello')).to.be.null
  })

  it('supports screen.queryByText() where it finds a node', async () => {
    const div = document.createElement('div')
    const textNode = document.createTextNode('hello')
    div.appendChild(textNode)
    document.body.appendChild(div)

    console.log(document.body.outerHTML)
    expect(screen.queryByText('hello')).to.eq(div)
  })
})
