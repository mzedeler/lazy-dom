import { screen } from '@testing-library/dom'
import { expect } from 'chai'

describe('@testing-library/dom', () => {
  afterEach(() => {
    // There is no built-in cleanup function in testing-library/dom, because it does
    // not know what was added to the DOM.
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

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

    expect(screen.getByText(/hello/)).to.eq(div)
  })

  it('supports screen.queryByTestId()', () => {
    const div = document.createElement('div')
    const textNode = document.createTextNode('hello')
    div.appendChild(textNode)
    document.body.appendChild(div)
    div.setAttribute('data-testid', 'some-id')

    expect(screen.queryByTestId('some-id')).to.eq(div)
  })
})
