import { HTMLElement } from "./HTMLElement"

export class HTMLStyleElement extends HTMLElement {
  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get media() {
    return this.getAttribute('media') ?? ''
  }
  set media(value: string) {
    this.setAttribute('media', value)
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }
}
