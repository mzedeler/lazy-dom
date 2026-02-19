import { getQueriesForElement } from '@testing-library/dom'

const NODE_COUNT = 100

export const tldomGetByRole = () => {
  const container = document.createElement('div')

  for (let i = 0; i < NODE_COUNT; i++) {
    const div = document.createElement('div')
    const span = document.createElement('span')
    span.appendChild(document.createTextNode('item ' + i))
    div.appendChild(span)
    container.appendChild(div)
  }

  const button = document.createElement('button')
  button.appendChild(document.createTextNode('Click me'))
  container.appendChild(button)

  document.body.appendChild(container)

  const { getByRole } = getQueriesForElement(document.body)
  getByRole('button')

  document.body.removeChild(container)
}
