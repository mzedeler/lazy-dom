import { HTMLElement } from "./HTMLElement"

export class HTMLUListElement extends HTMLElement {
  get compact() {
    return this.hasAttribute('compact')
  }
  set compact(val: boolean) {
    if (val) this.setAttribute('compact', '')
    else this.removeAttribute('compact')
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }
}
