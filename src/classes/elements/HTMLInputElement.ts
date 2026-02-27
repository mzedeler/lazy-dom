import { HTMLElement } from "./HTMLElement"

export class HTMLInputElement extends HTMLElement {
  get type() {
    return this.getAttribute('type') ?? 'text'
  }

  select() {}
}
