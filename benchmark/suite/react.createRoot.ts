import { createRoot } from 'react-dom/client'
import * as React from 'react'

// @ts-expect-error TODO
globalThis.IS_REACT_ACT_ENVIRONMENT = true

export const reactCreateRoot = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)

  React.act(() => root.render(React.createElement('h1', {}, 'Hello' )))
}
