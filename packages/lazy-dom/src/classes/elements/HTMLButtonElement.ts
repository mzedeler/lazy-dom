import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLButtonElement extends HTMLElement {
  declare name: string
  declare value: string
  declare disabled: boolean
  declare formAction: string
  declare formEnctype: string
  declare formMethod: string
  declare formTarget: string

  get type() {
    return this.getAttribute('type') ?? 'submit'
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get form() {
    return this.closest('form')
  }
}
defineStringReflections(HTMLButtonElement.prototype, [
  ['name', 'name'],
  ['value', 'value'],
  ['formAction', 'formaction'],
  ['formEnctype', 'formenctype'],
  ['formMethod', 'formmethod'],
  ['formTarget', 'formtarget'],
])
defineBooleanReflections(HTMLButtonElement.prototype, [
  ['disabled', 'disabled'],
])
