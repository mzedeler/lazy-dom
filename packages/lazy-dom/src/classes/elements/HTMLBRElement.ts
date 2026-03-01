import { HTMLElement } from "./HTMLElement"

export class HTMLBRElement extends HTMLElement {
  get clear() {
    return this.getAttribute('clear') ?? ''
  }
  set clear(value: string) {
    this.setAttribute('clear', value)
  }
}
