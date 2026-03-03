import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLTableSectionElement extends HTMLElement {
  declare align: string
  declare ch: string
  declare chOff: string
  declare vAlign: string

  insertRow() { return null }
  deleteRow() {}
}
defineStringReflections(HTMLTableSectionElement.prototype, [
  ['align', 'align'],
  ['ch', 'char'],
  ['chOff', 'charoff'],
  ['vAlign', 'valign'],
])
