import { HTMLElement } from "./HTMLElement"

export class HTMLDivElement extends HTMLElement {
  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }
}
