// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy

import { Window } from "./classes/Window"
import { Document } from "./classes/Document"

class EventTarget {}

class HTMLIFrameElement {}

class Navigator {}


const lazyDom = () => {
  const window = new Window()
  const document = new Document()
  // document.defaultView = window
  const navigator = new Navigator()
  const instances = { document, window, navigator }
  const classes = { HTMLIFrameElement, EventTarget }
  Object.assign(window, instances, classes)
  Object.assign(global, { window, document })
  return { window, document }
}

export default lazyDom
