import { HTMLElement } from "./HTMLElement"

export class HTMLLabelElement extends HTMLElement {
  get htmlFor() {
    return this.getAttribute('for') ?? ''
  }
  set htmlFor(value: string) {
    this.setAttribute('for', value)
  }

  get form() {
    return null
  }

  get control() {
    const htmlFor = this.getAttribute('for')
    if (htmlFor) {
      return this.ownerDocument.getElementById(htmlFor)
    }
    return null
  }
}
