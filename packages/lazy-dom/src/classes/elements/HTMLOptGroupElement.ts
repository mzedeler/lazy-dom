import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLOptGroupElement extends HTMLElement {
  declare disabled: boolean
  declare label: string
}
defineStringReflections(HTMLOptGroupElement.prototype, [
  ['label', 'label'],
])
defineBooleanReflections(HTMLOptGroupElement.prototype, [
  ['disabled', 'disabled'],
])
