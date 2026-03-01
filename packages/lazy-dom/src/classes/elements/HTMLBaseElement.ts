import { HTMLElement } from "./HTMLElement"

export class HTMLBaseElement extends HTMLElement {
  get href() {
    return this.getAttribute('href') ?? ''
  }
  set href(value: string) {
    this.setAttribute('href', value)
  }

  get target() {
    return this.getAttribute('target') ?? ''
  }
  set target(value: string) {
    this.setAttribute('target', value)
  }
}
