import { HTMLElement } from "./HTMLElement"

export class HTMLAnchorElement extends HTMLElement {
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

  get charset() {
    return this.getAttribute('charset') ?? ''
  }
  set charset(value: string) {
    this.setAttribute('charset', value)
  }

  get coords() {
    return this.getAttribute('coords') ?? ''
  }
  set coords(value: string) {
    this.setAttribute('coords', value)
  }

  get hreflang() {
    return this.getAttribute('hreflang') ?? ''
  }
  set hreflang(value: string) {
    this.setAttribute('hreflang', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get rel() {
    return this.getAttribute('rel') ?? ''
  }
  set rel(value: string) {
    this.setAttribute('rel', value)
  }

  get rev() {
    return this.getAttribute('rev') ?? ''
  }
  set rev(value: string) {
    this.setAttribute('rev', value)
  }

  get shape() {
    return this.getAttribute('shape') ?? ''
  }
  set shape(value: string) {
    this.setAttribute('shape', value)
  }

  get target() {
    return this.getAttribute('target') ?? ''
  }
  set target(value: string) {
    this.setAttribute('target', value)
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get text() {
    return this.textContent
  }

  toString() {
    return this.href
  }
}
