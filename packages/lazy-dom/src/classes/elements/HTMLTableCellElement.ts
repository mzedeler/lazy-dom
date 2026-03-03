import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLTableCellElement extends HTMLElement {
  declare abbr: string
  declare align: string
  declare axis: string
  declare bgColor: string
  declare ch: string
  declare chOff: string
  declare colSpan: number
  declare headers: string
  declare height: string
  declare noWrap: boolean
  declare rowSpan: number
  declare scope: string
  declare vAlign: string
  declare width: string

  get cellIndex() {
    return 0
  }
}
defineStringReflections(HTMLTableCellElement.prototype, [
  ['abbr', 'abbr'],
  ['align', 'align'],
  ['axis', 'axis'],
  ['bgColor', 'bgcolor'],
  ['ch', 'char'],
  ['chOff', 'charoff'],
  ['headers', 'headers'],
  ['height', 'height'],
  ['scope', 'scope'],
  ['vAlign', 'valign'],
  ['width', 'width'],
])
defineBooleanReflections(HTMLTableCellElement.prototype, [
  ['noWrap', 'nowrap'],
])
defineNumericReflections(HTMLTableCellElement.prototype, [
  ['colSpan', 'colspan', 1],
  ['rowSpan', 'rowspan', 1],
])
