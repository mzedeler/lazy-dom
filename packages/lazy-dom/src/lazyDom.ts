// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy

import { Window } from "./classes/Window"
import { Document } from "./classes/Document"
import { Range } from "./classes/Range"
import { Selection } from "./classes/Selection"
import { Node } from "./classes/Node"
import { Element } from "./classes/Element"
import { Text } from "./classes/Text"
import { Comment } from "./classes/Comment"
import { DocumentFragment } from "./classes/DocumentFragment"
import { CharacterData } from "./classes/CharacterData"
import { Attr } from "./classes/Attr"
import { NamedNodeMap } from "./classes/NamedNodeMap"
import { DOMException } from "./classes/DOMException"
import { CSSStyleDeclaration } from "./classes/CSSStyleDeclaration"
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
import { HTMLTextAreaElement } from "./classes/elements/HTMLTextAreaElement"
import { HTMLSelectElement } from "./classes/elements/HTMLSelectElement"
import { HTMLOptionElement } from "./classes/elements/HTMLOptionElement"
import { HTMLOptGroupElement } from "./classes/elements/HTMLOptGroupElement"
import { HTMLTableElement } from "./classes/elements/HTMLTableElement"
import { HTMLTableRowElement } from "./classes/elements/HTMLTableRowElement"
import { HTMLTableCellElement } from "./classes/elements/HTMLTableCellElement"
import { HTMLTableSectionElement } from "./classes/elements/HTMLTableSectionElement"
import { HTMLTableCaptionElement } from "./classes/elements/HTMLTableCaptionElement"
import { HTMLTableColElement } from "./classes/elements/HTMLTableColElement"
import { HTMLBodyElement } from "./classes/elements/HTMLBodyElement"
import { HTMLUnknownElement } from "./classes/elements/HTMLUnknownElement"
import { HTMLHtmlElement } from "./classes/elements/HTMLHtmlElement"
import { HTMLHeadingElement } from "./classes/elements/HTMLHeadingElement"
import { HTMLLabelElement } from "./classes/elements/HTMLLabelElement"
import { HTMLFieldSetElement } from "./classes/elements/HTMLFieldSetElement"
import { HTMLLegendElement } from "./classes/elements/HTMLLegendElement"
import { HTMLAreaElement } from "./classes/elements/HTMLAreaElement"
import { HTMLBRElement } from "./classes/elements/HTMLBRElement"
import { HTMLBaseElement } from "./classes/elements/HTMLBaseElement"
import { HTMLDListElement } from "./classes/elements/HTMLDListElement"
import { HTMLHRElement } from "./classes/elements/HTMLHRElement"
import { HTMLLinkElement } from "./classes/elements/HTMLLinkElement"
import { HTMLMapElement } from "./classes/elements/HTMLMapElement"
import { HTMLMetaElement } from "./classes/elements/HTMLMetaElement"
import { HTMLModElement } from "./classes/elements/HTMLModElement"
import { HTMLOListElement } from "./classes/elements/HTMLOListElement"
import { HTMLObjectElement } from "./classes/elements/HTMLObjectElement"
import { HTMLParamElement } from "./classes/elements/HTMLParamElement"
import { HTMLQuoteElement } from "./classes/elements/HTMLQuoteElement"
import { HTMLScriptElement } from "./classes/elements/HTMLScriptElement"
import { HTMLStyleElement } from "./classes/elements/HTMLStyleElement"
import { HTMLTitleElement } from "./classes/elements/HTMLTitleElement"
import { HTMLParagraphElement } from "./classes/elements/HTMLParagraphElement"
import { HTMLPreElement } from "./classes/elements/HTMLPreElement"
import { HTMLUListElement } from "./classes/elements/HTMLUListElement"
import { Event } from "./classes/Event"
import { UIEvent } from "./classes/UIEvent"
import { MouseEvent } from "./classes/MouseEvent"
import { KeyboardEvent } from "./classes/KeyboardEvent"
import { InputEvent } from "./classes/InputEvent"
import { FocusEvent } from "./classes/FocusEvent"
import { PointerEvent } from "./classes/PointerEvent"
import { ProgressEvent } from "./classes/ProgressEvent"
import { ErrorEvent } from "./classes/ErrorEvent"
import { CustomEvent } from "./classes/CustomEvent"
import { CompositionEvent } from "./classes/CompositionEvent"
import { MutationObserver } from "./classes/MutationObserver"
import { MutationRecord } from "./classes/MutationObserver"
import { EventTarget } from "./classes/EventTarget"

export { JSDOM } from "./jsdom"

class Navigator {
  private _userAgent = ''
  private _platform = ''

  get userAgent() { return this._userAgent }
  set userAgent(v: string) { this._userAgent = v }

  get platform() { return this._platform }
  set platform(v: string) { this._platform = v }

  get language() { return 'en-US' }
  get languages() { return ['en-US'] }
  get onLine() { return true }
  get cookieEnabled() { return true }
}

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
    Event,
    UIEvent,
    MouseEvent,
    KeyboardEvent,
    InputEvent,
    FocusEvent,
    PointerEvent,
    ProgressEvent,
    ErrorEvent,
    CustomEvent,
    CompositionEvent,
    CSSStyleDeclaration,
    EventTarget,
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
    HTMLTextAreaElement,
    HTMLSelectElement,
    HTMLOptionElement,
    HTMLOptGroupElement,
    HTMLTableElement,
    HTMLTableRowElement,
    HTMLTableCellElement,
    HTMLTableSectionElement,
    HTMLTableCaptionElement,
    HTMLTableColElement,
    HTMLBodyElement,
    HTMLUnknownElement,
    HTMLHtmlElement,
    HTMLHeadingElement,
    HTMLLabelElement,
    HTMLFieldSetElement,
    HTMLLegendElement,
    HTMLAreaElement,
    HTMLBRElement,
    HTMLBaseElement,
    HTMLDListElement,
    HTMLHRElement,
    HTMLLinkElement,
    HTMLMapElement,
    HTMLMetaElement,
    HTMLModElement,
    HTMLOListElement,
    HTMLObjectElement,
    HTMLParamElement,
    HTMLQuoteElement,
    HTMLScriptElement,
    HTMLStyleElement,
    HTMLTitleElement,
    HTMLParagraphElement,
    HTMLPreElement,
    HTMLUListElement,
    SVGElement,
    Range,
    Selection,
    Document,
    MutationObserver,
    MutationRecord,
  }
  Object.assign(window, instances, classes)
  Object.assign(global, { window, document }, classes)

  return { window, document, classes }
}

export default lazyDom
