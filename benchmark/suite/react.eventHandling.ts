import { createRoot } from 'react-dom/client'
import * as React from 'react'

// @ts-expect-error TODO
globalThis.IS_REACT_ACT_ENVIRONMENT = true

export const reactEventHandling = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  const onClick = () => {}
  const children: ReturnType<typeof React.createElement>[] = [
    React.createElement('span', {}, 'child')
  ]
  React.act(() => root.render(React.createElement('span', { onClick, children }, 'Hello' )))
  const [span] = div.childNodes

  // @ts-expect-error click is on span
  React.act(() => span.click())
}
