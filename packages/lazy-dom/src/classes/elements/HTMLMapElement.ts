import { HTMLElement } from "./HTMLElement"

export class HTMLMapElement extends HTMLElement {
  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }
}
