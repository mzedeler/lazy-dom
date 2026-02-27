// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy

import { Window } from "./classes/Window"
import { Document } from "./classes/Document"
import { HTMLDivElement } from "./classes/elements/HTMLDivElement"
import { HTMLCanvasElement } from "./classes/elements/HTMLCanvasElement"
import { HTMLLIElement } from "./classes/elements/HTMLLIElement"
import { HTMLSpanElement } from "./classes/elements/HTMLSpanElement"
import { SVGElement } from "./classes/elements/SVGElement"

class EventTarget {}

class HTMLIFrameElement {}

class Navigator {}

const lazyDom = () => {
  const window = new Window()
  const document = new Document()
  document.defaultView = window
  const navigator = new Navigator()
  const instances = { document, window, navigator }
  const classes = { HTMLDivElement, HTMLLIElement, HTMLIFrameElement, EventTarget, HTMLCanvasElement, HTMLSpanElement, SVGElement }
  Object.assign(window, instances, classes)
  Object.assign(global, { window, document }, classes)

  return { window, document, classes }
}

export default lazyDom
