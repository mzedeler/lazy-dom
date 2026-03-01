import { HTMLElement } from "./HTMLElement"

export class HTMLHtmlElement extends HTMLElement {
  get version() {
    return this.getAttribute('version') ?? ''
  }
  set version(value: string) {
    this.setAttribute('version', value)
  }
}
