// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy

import { Window } from "./classes/Window"
import { Document } from "./classes/Document"
import { Node } from "./classes/Node"
import { Element } from "./classes/Element"
import { Text } from "./classes/Text"
import { Comment } from "./classes/Comment"
import { DocumentFragment } from "./classes/DocumentFragment"
import { CharacterData } from "./classes/CharacterData"
import { Attr } from "./classes/Attr"
import { NamedNodeMap } from "./classes/NamedNodeMap"
import { DOMException } from "./classes/DOMException"
import { HTMLCollection } from "./classes/HTMLCollection"
import { NodeList } from "./classes/NodeList"
import { HTMLElement } from "./classes/elements/HTMLElement"
import { HTMLDivElement } from "./classes/elements/HTMLDivElement"
import { HTMLCanvasElement } from "./classes/elements/HTMLCanvasElement"
import { HTMLLIElement } from "./classes/elements/HTMLLIElement"
import { HTMLSpanElement } from "./classes/elements/HTMLSpanElement"
import { HTMLInputElement } from "./classes/elements/HTMLInputElement"
import { HTMLButtonElement } from "./classes/elements/HTMLButtonElement"
import { HTMLFormElement } from "./classes/elements/HTMLFormElement"
import { HTMLAnchorElement } from "./classes/elements/HTMLAnchorElement"
import { HTMLImageElement } from "./classes/elements/HTMLImageElement"
import { SVGElement } from "./classes/elements/SVGElement"
import { HTMLIFrameElement } from "./classes/elements/HTMLIFrameElement"

export { JSDOM } from "./jsdom"

class Navigator {}

const lazyDom = () => {
  const window = new Window()
  const document = new Document()
  document.defaultView = window
  const navigator = new Navigator()
  const instances = { document, window, navigator }
  const classes = {
    Node,
    Element,
    Text,
    Comment,
    DocumentFragment,
    CharacterData,
    Attr,
    NamedNodeMap,
    DOMException,
    HTMLCollection,
    NodeList,
    EventTarget: globalThis.EventTarget,
    HTMLElement,
    HTMLDivElement,
    HTMLLIElement,
    HTMLIFrameElement,
    HTMLCanvasElement,
    HTMLSpanElement,
    HTMLInputElement,
    HTMLButtonElement,
    HTMLFormElement,
    HTMLAnchorElement,
    HTMLImageElement,
    SVGElement,
  }
  Object.assign(window, instances, classes)
  Object.assign(global, { window, document }, classes)

  return { window, document, classes }
}

export default lazyDom
