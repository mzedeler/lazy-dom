import { Element } from "../Element"
import { defineStringReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class SVGElement extends Element {
  declare tabIndex: number
  declare className: string
}
defineStringReflections(SVGElement.prototype, [
  ['className', 'class'],
])
defineNumericReflections(SVGElement.prototype, [
  ['tabIndex', 'tabindex', -1],
])
