import { HTMLElement } from "./HTMLElement"

export class HTMLLIElement extends HTMLElement {
  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get value() {
    const val = this.getAttribute('value')
    return val !== null ? parseInt(val, 10) : 0
  }
  set value(val: number) {
    this.setAttribute('value', String(val))
  }
}
