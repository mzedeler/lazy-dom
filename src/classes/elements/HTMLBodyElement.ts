import { HTMLElement } from "./HTMLElement"

export class HTMLBodyElement extends HTMLElement {
  constructor() {
    super()
    this.elementStore.tagName = () => 'body'
  }
}
