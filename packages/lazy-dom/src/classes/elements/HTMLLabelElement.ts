import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLLabelElement extends HTMLElement {
  declare htmlFor: string

  get form() {
    return this.closest('form')
  }

  get control() {
    const htmlFor = this.getAttribute('for')
    if (htmlFor) {
      return this.ownerDocument.getElementById(htmlFor)
    }
    return null
  }
}
defineStringReflections(HTMLLabelElement.prototype, [
  ['htmlFor', 'for'],
])
