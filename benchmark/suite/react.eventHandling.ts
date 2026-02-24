import { createRoot } from 'react-dom/client'
import * as React from 'react'

// @ts-expect-error TODO
globalThis.IS_REACT_ACT_ENVIRONMENT = true

export const reactEventHandling = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  const onClick = () => {}
  const children: React.ReactNode[] = [
    React.createElement('span', {}, 'child says hello')
  ]
  React.act(() => root.render(React.createElement('span', { onClick }, ...children )))
  const span = div.childNodes.item(0)

  // @ts-expect-error click is on span
  React.act(() => span.click())
}
