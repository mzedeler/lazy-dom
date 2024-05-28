import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { screen } from '@testing-library/dom'
import { expect } from 'chai'

import App from './todo-react/src/App.jsx'

describe('todoApp', () => {
  it('can render', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)

    React.act(() => root.render(React.createElement(App, { tasks: [] })))

    React.act(() => root.unmount())
    document.body.removeChild(div)
  })

  it('has title', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)

    React.act(() => root.render(React.createElement(App, { tasks: [] })))

    expect(screen.getByText('TodoMatic')).to.have.property('tagName', 'H1')

    React.act(() => root.unmount())
    document.body.removeChild(div)
  })
})
