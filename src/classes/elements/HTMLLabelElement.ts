import { Element } from "../Element"

export class HTMLLabelElement extends Element {
  get control() {
    const htmlFor = this.getAttribute('for')
    if (htmlFor) {
      return this.ownerDocument.getElementById(htmlFor)
    }
    return null
  }
}
