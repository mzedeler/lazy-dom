import { HTMLElement } from "./HTMLElement"

export class HTMLButtonElement extends HTMLElement {
  get type() {
    return this.getAttribute('type') ?? 'submit'
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get value() {
    return this.getAttribute('value') ?? ''
  }
  set value(val: string) {
    this.setAttribute('value', val)
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get form() {
    return null
  }
}
