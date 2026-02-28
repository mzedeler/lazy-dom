import { HTMLElement } from "./HTMLElement"

export class HTMLOListElement extends HTMLElement {
  get compact() {
    return this.hasAttribute('compact')
  }
  set compact(value: boolean) {
    if (value) this.setAttribute('compact', '')
    else this.removeAttribute('compact')
  }

  get start() {
    const val = this.getAttribute('start')
    return val ? parseInt(val, 10) : 0
  }
  set start(value: number) {
    this.setAttribute('start', String(value))
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }
}
