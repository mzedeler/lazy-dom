import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLLegendElement extends HTMLElement {
  declare align: string

  get form() {
    return this.closest('form')
  }
}
defineStringReflections(HTMLLegendElement.prototype, [
  ['align', 'align'],
])
