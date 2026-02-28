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
import { setAttribute10, setAttribute50, setAttribute100, setAttributeOverwrite50 } from './suite/dom.setAttribute'
import { textContentFlat100, textContentDeep20, textContentMixed } from './suite/dom.textContent'
import { outerHTMLWideTree, outerHTMLDeepTree, outerHTMLRealisticTree, innerHTMLContainer } from './suite/dom.outerHTML'
import { bulkTreeSmall, bulkTreeMedium, bulkTreeLarge } from './suite/dom.bulkTreeConstruction'
import { reactDeepRender, reactDeepRenderWithSnapshot, reactDeepRenderRerender } from './suite/react.deepRender'

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
  // setAttribute thunk chain depth
  .add('lazyDom: setAttribute x10 + read', setAttribute10, lazyDomOptions)
  .add('JSDOM: setAttribute x10 + read', setAttribute10, JSDOMOptions)
  .add('lazyDom: setAttribute x50 + read', setAttribute50, lazyDomOptions)
  .add('JSDOM: setAttribute x50 + read', setAttribute50, JSDOMOptions)
  .add('lazyDom: setAttribute x100 + read', setAttribute100, lazyDomOptions)
  .add('JSDOM: setAttribute x100 + read', setAttribute100, JSDOMOptions)
  .add('lazyDom: setAttribute overwrite x50', setAttributeOverwrite50, lazyDomOptions)
  .add('JSDOM: setAttribute overwrite x50', setAttributeOverwrite50, JSDOMOptions)
  // textContent reading
  .add('lazyDom: textContent flat 100', textContentFlat100, lazyDomOptions)
  .add('JSDOM: textContent flat 100', textContentFlat100, JSDOMOptions)
  .add('lazyDom: textContent deep 20', textContentDeep20, lazyDomOptions)
  .add('JSDOM: textContent deep 20', textContentDeep20, JSDOMOptions)
  .add('lazyDom: textContent mixed 50', textContentMixed, lazyDomOptions)
  .add('JSDOM: textContent mixed 50', textContentMixed, JSDOMOptions)
  // DOM serialization (outerHTML / innerHTML)
  .add('lazyDom: outerHTML wide (100 children)', outerHTMLWideTree, lazyDomOptions)
  .add('JSDOM: outerHTML wide (100 children)', outerHTMLWideTree, JSDOMOptions)
  .add('lazyDom: outerHTML deep (20 levels)', outerHTMLDeepTree, lazyDomOptions)
  .add('JSDOM: outerHTML deep (20 levels)', outerHTMLDeepTree, JSDOMOptions)
  .add('lazyDom: outerHTML realistic (~70 elements)', outerHTMLRealisticTree, lazyDomOptions)
  .add('JSDOM: outerHTML realistic (~70 elements)', outerHTMLRealisticTree, JSDOMOptions)
  .add('lazyDom: innerHTML (50 spans)', innerHTMLContainer, lazyDomOptions)
  .add('JSDOM: innerHTML (50 spans)', innerHTMLContainer, JSDOMOptions)
  // Bulk tree construction (no reading)
  .add('lazyDom: bulk tree ~50 elements', bulkTreeSmall, lazyDomOptions)
  .add('JSDOM: bulk tree ~50 elements', bulkTreeSmall, JSDOMOptions)
  .add('lazyDom: bulk tree ~100 elements', bulkTreeMedium, lazyDomOptions)
  .add('JSDOM: bulk tree ~100 elements', bulkTreeMedium, JSDOMOptions)
  .add('lazyDom: bulk tree ~200 elements', bulkTreeLarge, lazyDomOptions)
  .add('JSDOM: bulk tree ~200 elements', bulkTreeLarge, JSDOMOptions)
  // React deep render with nested providers
  .add('lazyDom: React deep render (6 providers)', reactDeepRender, lazyDomOptions)
  .add('JSDOM: React deep render (6 providers)', reactDeepRender, JSDOMOptions)
  .add('lazyDom: React deep render + snapshot', reactDeepRenderWithSnapshot, lazyDomOptions)
  .add('JSDOM: React deep render + snapshot', reactDeepRenderWithSnapshot, JSDOMOptions)
  .add('lazyDom: React deep render + rerender', reactDeepRenderRerender, lazyDomOptions)
  .add('JSDOM: React deep render + rerender', reactDeepRenderRerender, JSDOMOptions)

const main = async () => {
  await bench.warmup()
  await bench.run()
  console.table(bench.table())
}

main()
