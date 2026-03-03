import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLFrameElement extends HTMLElement {
  declare name: string

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
defineStringReflections(HTMLFrameElement.prototype, [
  ['name', 'name'],
])
