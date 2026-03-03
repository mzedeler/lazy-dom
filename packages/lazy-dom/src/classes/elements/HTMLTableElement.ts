import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLTableElement extends HTMLElement {
  declare align: string
  declare bgColor: string
  declare border: string
  declare cellPadding: string
  declare cellSpacing: string
  declare frame: string
  declare rules: string
  declare summary: string
  declare width: string

  get caption() {
    return null
  }

  get tHead() {
    return null
  }

  get tFoot() {
    return null
  }

  createTHead() { return null }
  deleteTHead() {}
  createTFoot() { return null }
  deleteTFoot() {}
  createCaption() { return null }
  deleteCaption() {}
  insertRow() { return null }
  deleteRow() {}
}
defineStringReflections(HTMLTableElement.prototype, [
  ['align', 'align'],
  ['bgColor', 'bgcolor'],
  ['border', 'border'],
  ['cellPadding', 'cellpadding'],
  ['cellSpacing', 'cellspacing'],
  ['frame', 'frame'],
  ['rules', 'rules'],
  ['summary', 'summary'],
  ['width', 'width'],
])
