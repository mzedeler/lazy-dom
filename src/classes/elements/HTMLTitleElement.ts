import { HTMLElement } from "./HTMLElement"

export class HTMLTitleElement extends HTMLElement {
  get text() {
    return this.textContent ?? ''
  }
  set text(value: string) {
    this.textContent = value
  }
}
