import { HTMLElement } from "./HTMLElement"

export class HTMLAreaElement extends HTMLElement {
  get accessKey() {
    return this.getAttribute('accesskey') ?? ''
  }
  set accessKey(value: string) {
    this.setAttribute('accesskey', value)
  }

  get alt() {
    return this.getAttribute('alt') ?? ''
  }
  set alt(value: string) {
    this.setAttribute('alt', value)
  }

  get coords() {
    return this.getAttribute('coords') ?? ''
  }
  set coords(value: string) {
    this.setAttribute('coords', value)
  }

  get href() {
    return this.getAttribute('href') ?? ''
  }
  set href(value: string) {
    this.setAttribute('href', value)
  }

  get noHref() {
    return this.hasAttribute('nohref')
  }
  set noHref(value: boolean) {
    if (value) this.setAttribute('nohref', '')
    else this.removeAttribute('nohref')
  }

  get shape() {
    return this.getAttribute('shape') ?? ''
  }
  set shape(value: string) {
    this.setAttribute('shape', value)
  }

  get tabIndex() {
    const val = this.getAttribute('tabindex')
    return val ? parseInt(val, 10) : 0
  }
  set tabIndex(value: number) {
    this.setAttribute('tabindex', String(value))
  }

  get target() {
    return this.getAttribute('target') ?? ''
  }
  set target(value: string) {
    this.setAttribute('target', value)
  }
}
