import { Bench } from 'tinybench'
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { JSDOM } from 'jsdom'
import lazyDom from './lazyDom'

// @ts-expect-error
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const bench = new Bench({ time: 1000 })

const lazyDomOptions = { beforeAll: lazyDom }
const JSDOMOptions = { beforeAll: () => {
  const dom = new JSDOM(``, {
    url: "https://example.org/",
    referrer: "https://example.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000
  })

  // @ts-expect-error
  global.window = dom.window
  global.document = dom.window.document
}}

const createReactRoot = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)

  React.act(() => root.render(React.createElement('h1', {}, 'Hello' )))
}

const createElement = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)

  React.act(() => root.render(React.createElement('h1', {}, 'Hello' )))
}

const eventHandling = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  let clicked = false
  const onClick = () => { clicked = true }
  const children: ReturnType<typeof React.createElement>[] = [
    React.createElement('span', {}, 'child')
  ]
  React.act(() => root.render(React.createElement('span', { onClick, children }, 'Hello' )))
  const [span] = div.childNodes

  // @ts-expect-error click is on span
  React.act(() => span.click())
}

bench
  .add('lazyDom: React.createRoot', createReactRoot, lazyDomOptions)
  .add('JSDOM: React.createRoot', createReactRoot, JSDOMOptions)
  .add('lazyDom: React.createRoot + React.createElement', createElement, lazyDomOptions)
  .add('JSDOM: React.createRoot + React.createElement', createElement, JSDOMOptions)
  .add('lazyDom: event handling', eventHandling, lazyDomOptions)
  .add('JSDOM: event handling', eventHandling, JSDOMOptions)

const main = async () => {
  await bench.warmup()
  await bench.run()
  console.table(bench.table())
}

main()
