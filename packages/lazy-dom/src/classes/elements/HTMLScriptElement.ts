import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLScriptElement extends HTMLElement {
  declare charset: string
  declare defer: boolean
  declare event: string
  declare htmlFor: string
  declare src: string
  declare type: string

  get text() {
    return this.textContent ?? ''
  }
  set text(value: string) {
    this.textContent = value
  }
}
defineStringReflections(HTMLScriptElement.prototype, [
  ['charset', 'charset'],
  ['event', 'event'],
  ['htmlFor', 'for'],
  ['src', 'src'],
  ['type', 'type'],
])
defineBooleanReflections(HTMLScriptElement.prototype, [
  ['defer', 'defer'],
])
