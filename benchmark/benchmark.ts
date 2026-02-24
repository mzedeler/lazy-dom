import { Bench } from 'tinybench'
import { JSDOM } from 'jsdom'
import lazyDom from '../src/lazyDom'
import { domRemoveChild } from './suite/dom.removeChild'
import { reactCreateElement } from './suite/react.createElement'
import { reactEventHandling } from './suite/react.eventHandling'
import { reactCreateRoot } from './suite/react.createRoot'
import { tldomGetByRole } from './suite/tldom.getByRole'
import { childNodeListIndexAccess, childNodeListIteration, childNodeListLength, childNodeListArrayFrom } from './suite/dom.childNodeList'
import { documentGetElementById, documentGetElementsByTagNameNS, documentAllLazyDom, documentAllJsdom } from './suite/dom.documentElements'

// @ts-expect-error TODO
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const bench = new Bench({ time: 200 })

const lazyDomOptions = { beforeAll: () => { lazyDom() } }
const JSDOMOptions = { beforeAll: () => {
  const dom = new JSDOM(``, {
    url: "https://example.org/",
    referrer: "https://example.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000
  })

  // @ts-expect-error TODO
  global.window = dom.window
  global.document = dom.window.document
}}

bench
  .add('lazyDom: React.createRoot', reactCreateRoot, lazyDomOptions)
  .add('JSDOM: React.createRoot', reactCreateRoot, JSDOMOptions)
  .add('lazyDom: React.createRoot + React.createElement', reactCreateElement, lazyDomOptions)
  .add('JSDOM: React.createRoot + React.createElement', reactCreateElement, JSDOMOptions)
  .add('lazyDom: event handling', reactEventHandling, lazyDomOptions)
  .add('JSDOM: event handling', reactEventHandling, JSDOMOptions)
  .add('lazyDom: removing child', domRemoveChild, lazyDomOptions)
  .add('JSDOM: removing child', domRemoveChild, JSDOMOptions)
  .add('lazyDom: getByRole', tldomGetByRole, lazyDomOptions)
  .add('JSDOM: getByRole', tldomGetByRole, JSDOMOptions)
  .add('lazyDom: childNodes[i] access', childNodeListIndexAccess, lazyDomOptions)
  .add('JSDOM: childNodes[i] access', childNodeListIndexAccess, JSDOMOptions)
  .add('lazyDom: childNodes.forEach', childNodeListIteration, lazyDomOptions)
  .add('JSDOM: childNodes.forEach', childNodeListIteration, JSDOMOptions)
  .add('lazyDom: childNodes.length', childNodeListLength, lazyDomOptions)
  .add('JSDOM: childNodes.length', childNodeListLength, JSDOMOptions)
  .add('lazyDom: Array.from(childNodes)', childNodeListArrayFrom, lazyDomOptions)
  .add('JSDOM: Array.from(childNodes)', childNodeListArrayFrom, JSDOMOptions)
  .add('lazyDom: getElementById (depth-5 tree)', documentGetElementById, lazyDomOptions)
  .add('JSDOM: getElementById (depth-5 tree)', documentGetElementById, JSDOMOptions)
  .add('lazyDom: getElementsByTagNameNS (depth-5 tree)', documentGetElementsByTagNameNS, lazyDomOptions)
  .add('JSDOM: getElementsByTagNameNS (depth-5 tree)', documentGetElementsByTagNameNS, JSDOMOptions)
  .add('lazyDom: document.all (depth-5 tree)', documentAllLazyDom, lazyDomOptions)
  .add('JSDOM: querySelectorAll(*) (depth-5 tree)', documentAllJsdom, JSDOMOptions)

const main = async () => {
  await bench.warmup()
  await bench.run()
  console.table(bench.table())
}

main()
