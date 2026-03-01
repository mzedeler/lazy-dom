import { createRoot } from 'react-dom/client'
import * as React from 'react'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

export const reactCreateElement = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)

  React.act(() => root.render(React.createElement('h1', {}, 'Hello' )))
}
