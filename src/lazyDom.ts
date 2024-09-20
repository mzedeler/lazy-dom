// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy

import { Window } from "./classes/Window"
import { Document } from "./classes/Document"
import { HTMLDivElement } from "./classes/elements/HTMLDivElement"
import { HTMLCanvasElement } from "./classes/elements/HTMLCanvasElement"

class EventTarget {}

class HTMLIFrameElement {}

class Navigator {}

const lazyDom = () => {
  console.log('*********************** called!')
  const window = new Window()
  const document = new Document()
  // document.defaultView = window
  const navigator = new Navigator()
  const instances = { document, window, navigator }
  const classes = { HTMLDivElement, HTMLIFrameElement, EventTarget, HTMLCanvasElement }
  Object.assign(window, instances, classes)
  Object.assign(global, { window, document }, classes)

  console.log({ window })
  return { window, document, classes }
}

export default lazyDom
