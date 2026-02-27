import { HTMLElement } from "./HTMLElement"

export class HTMLLabelElement extends HTMLElement {
  get control() {
    const htmlFor = this.getAttribute('for')
    if (htmlFor) {
      return this.ownerDocument.getElementById(htmlFor)
    }
    return null
  }
}
