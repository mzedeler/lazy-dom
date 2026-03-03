import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLHtmlElement extends HTMLElement {
  declare version: string
}
defineStringReflections(HTMLHtmlElement.prototype, [
  ['version', 'version'],
])
