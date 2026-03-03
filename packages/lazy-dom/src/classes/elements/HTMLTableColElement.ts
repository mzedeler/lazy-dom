import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLTableColElement extends HTMLElement {
  declare align: string
  declare ch: string
  declare chOff: string
  declare span: number
  declare vAlign: string
  declare width: string
}
defineStringReflections(HTMLTableColElement.prototype, [
  ['align', 'align'],
  ['ch', 'char'],
  ['chOff', 'charoff'],
  ['vAlign', 'valign'],
  ['width', 'width'],
])
defineNumericReflections(HTMLTableColElement.prototype, [
  ['span', 'span', 1],
])
