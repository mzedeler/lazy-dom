import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLAnchorElement extends HTMLElement {
  declare charset: string
  declare coords: string
  declare hreflang: string
  declare name: string
  declare rel: string
  declare rev: string
  declare shape: string
  declare target: string
  declare type: string

  get href() {
    const val = this.getAttribute('href')
    if (!val) return ''
    try { return new URL(val).href } catch { return val }
  }
  set href(value: string) {
    this.setAttribute('href', value)
  }

  get pathname() {
    const val = this.getAttribute('href')
    if (!val) return ''
    try { return new URL(val).pathname } catch { return '' }
  }

  get protocol() {
    const val = this.getAttribute('href')
    if (!val) return ':'
    try { return new URL(val).protocol } catch { return ':' }
  }

  get host() {
    const val = this.getAttribute('href')
    if (!val) return ''
    try { return new URL(val).host } catch { return '' }
  }

  get search() {
    const val = this.getAttribute('href')
    if (!val) return ''
    try { return new URL(val).search } catch { return '' }
  }

  get hash() {
    const val = this.getAttribute('href')
    if (!val) return ''
    try { return new URL(val).hash } catch { return '' }
  }

  get hostname() {
    const val = this.getAttribute('href')
    if (!val) return ''
    try { return new URL(val).hostname } catch { return '' }
  }

  get port() {
    const val = this.getAttribute('href')
    if (!val) return ''
    try { return new URL(val).port } catch { return '' }
  }

  get text() {
    return this.textContent
  }

  toString() {
    return this.href
  }
}
defineStringReflections(HTMLAnchorElement.prototype, [
  ['charset', 'charset'],
  ['coords', 'coords'],
  ['hreflang', 'hreflang'],
  ['name', 'name'],
  ['rel', 'rel'],
  ['rev', 'rev'],
  ['shape', 'shape'],
  ['target', 'target'],
  ['type', 'type'],
])
