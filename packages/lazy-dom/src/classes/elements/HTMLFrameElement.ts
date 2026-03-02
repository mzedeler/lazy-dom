import { HTMLElement } from "./HTMLElement"

export class HTMLFrameElement extends HTMLElement {
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

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }
}
