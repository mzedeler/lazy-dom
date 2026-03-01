import { HTMLElement } from "./HTMLElement"

export class HTMLHRElement extends HTMLElement {
  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }

  get noShade() {
    return this.hasAttribute('noshade')
  }
  set noShade(value: boolean) {
    if (value) this.setAttribute('noshade', '')
    else this.removeAttribute('noshade')
  }

  get size() {
    return this.getAttribute('size') ?? ''
  }
  set size(value: string) {
    this.setAttribute('size', value)
  }

  get width() {
    return this.getAttribute('width') ?? ''
  }
  set width(value: string) {
    this.setAttribute('width', value)
  }
}
