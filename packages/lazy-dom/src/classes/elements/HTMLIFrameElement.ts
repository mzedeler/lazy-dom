import { HTMLElement } from "./HTMLElement"
import type { Document } from "../Document"
import type { Window } from "../Window"

export class HTMLIFrameElement extends HTMLElement {
  private _contentDocument: Document | null = null

  get contentDocument(): Document | null {
    if (!this._contentDocument) {
      // Lazily create an inner document, mimicking browser behavior
      // Import dynamically to avoid circular dependency
      const doc = this.ownerDocument
      const DocCtor = doc.constructor as new () => Document
      this._contentDocument = new DocCtor()
      // Set up the default view (window) for the inner document
      const WinCtor = (doc.defaultView?.constructor ?? Object) as new () => Window
      if (doc.defaultView) {
        const innerWindow = new WinCtor()
        this._contentDocument.defaultView = innerWindow
      }
    }
    return this._contentDocument
  }

  get contentWindow(): Window | null {
    return this.contentDocument?.defaultView ?? null
  }

  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }

  get frameBorder() {
    return this.getAttribute('frameborder') ?? ''
  }
  set frameBorder(value: string) {
    this.setAttribute('frameborder', value)
  }

  get height() {
    return this.getAttribute('height') ?? ''
  }
  set height(value: string) {
    this.setAttribute('height', value)
  }

  get longDesc() {
    return this.getAttribute('longdesc') ?? ''
  }
  set longDesc(value: string) {
    this.setAttribute('longdesc', value)
  }

  get marginHeight() {
    return this.getAttribute('marginheight') ?? ''
  }
  set marginHeight(value: string) {
    this.setAttribute('marginheight', value)
  }

  get marginWidth() {
    return this.getAttribute('marginwidth') ?? ''
  }
  set marginWidth(value: string) {
    this.setAttribute('marginwidth', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get scrolling() {
    return this.getAttribute('scrolling') ?? ''
  }
  set scrolling(value: string) {
    this.setAttribute('scrolling', value)
  }

  get src() {
    const raw = this.getAttribute('src')
    if (raw === null) return ''
    try {
      const loc = this.ownerDocument?.defaultView?.location
      const base = (typeof loc === 'object' ? loc?.href : loc) ?? 'http://localhost/'
      return new URL(raw, base).href
    } catch {
      return raw
    }
  }
  set src(value: string) {
    this.setAttribute('src', value)
  }

  get width() {
    return this.getAttribute('width') ?? ''
  }
  set width(value: string) {
    this.setAttribute('width', value)
  }
}
