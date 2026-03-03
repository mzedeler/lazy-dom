import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLHRElement extends HTMLElement {
  declare align: string
  declare noShade: boolean
  declare size: string
  declare width: string
}
defineStringReflections(HTMLHRElement.prototype, [
  ['align', 'align'],
  ['size', 'size'],
  ['width', 'width'],
])
defineBooleanReflections(HTMLHRElement.prototype, [
  ['noShade', 'noshade'],
])
