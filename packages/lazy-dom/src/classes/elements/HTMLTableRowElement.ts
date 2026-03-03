import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLTableRowElement extends HTMLElement {
  declare align: string
  declare bgColor: string
  declare ch: string
  declare chOff: string
  declare vAlign: string

  get rowIndex() {
    return -1
  }

  get sectionRowIndex() {
    return -1
  }

  insertCell() { return null }
  deleteCell() {}
}
defineStringReflections(HTMLTableRowElement.prototype, [
  ['align', 'align'],
  ['bgColor', 'bgcolor'],
  ['ch', 'char'],
  ['chOff', 'charoff'],
  ['vAlign', 'valign'],
])
