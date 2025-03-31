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

  it('supports screen.queryByTitle', () => {
    const title = 'some-title'
    const div = document.createElement('div')
    div.setAttribute('title', title)
    document.body.appendChild(div)

    expect(screen.queryByTitle(title)).to.eq(div)
  })

  it('supports screen.queryByAltText', () => {
    const altText = 'some-text'
    const img = document.createElement('img')
    img.setAttribute('alt', altText)
    document.body.appendChild(img)

    expect(screen.queryByAltText(altText)).to.eq(img)
  })

  it('supports screen.queryByText', () => {
    const text = 'hello there'
    const div = document.createElement('div')
    const textNode = document.createTextNode(text)
    div.appendChild(textNode)
    document.body.appendChild(div)

    expect(screen.queryByText(text)).to.eq(div)
  })

  describe('scren.queryByRole', () => {
    // Still not supported
    it.skip('role=button using button', () => {
      const role = 'button'
      const text = 'some text'
      const button = document.createElement('button')
      const textNode = document.createTextNode(text)
      button.appendChild(textNode)
      document.body.appendChild(button)
  
      expect(screen.queryByRole(role)).to.eq(button)
    })  
  })
})
