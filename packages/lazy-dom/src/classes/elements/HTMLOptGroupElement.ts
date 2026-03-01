import { HTMLElement } from "./HTMLElement"

export class HTMLOptGroupElement extends HTMLElement {
  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get label() {
    return this.getAttribute('label') ?? ''
  }
  set label(value: string) {
    this.setAttribute('label', value)
  }
}
