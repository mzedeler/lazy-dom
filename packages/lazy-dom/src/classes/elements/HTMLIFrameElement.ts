import { HTMLElement } from "./HTMLElement"
import type { Document } from "../Document"
import type { Window } from "../Window"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLIFrameElement extends HTMLElement {
  private _contentDocument: Document | null = null
  declare align: string
  declare frameBorder: string
  declare height: string
  declare longDesc: string
  declare marginHeight: string
  declare marginWidth: string
  declare name: string
  declare scrolling: string
  declare width: string

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
}
defineStringReflections(HTMLIFrameElement.prototype, [
  ['align', 'align'],
  ['frameBorder', 'frameborder'],
  ['height', 'height'],
  ['longDesc', 'longdesc'],
  ['marginHeight', 'marginheight'],
  ['marginWidth', 'marginwidth'],
  ['name', 'name'],
  ['scrolling', 'scrolling'],
  ['width', 'width'],
])
