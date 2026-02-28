import { HTMLElement } from "./HTMLElement"

export class HTMLTableRowElement extends HTMLElement {
  get rowIndex() {
    return -1
  }

  get sectionRowIndex() {
    return -1
  }

  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }

  get bgColor() {
    return this.getAttribute('bgcolor') ?? ''
  }
  set bgColor(value: string) {
    this.setAttribute('bgcolor', value)
  }

  get ch() {
    return this.getAttribute('char') ?? ''
  }
  set ch(value: string) {
    this.setAttribute('char', value)
  }

  get chOff() {
    return this.getAttribute('charoff') ?? ''
  }
  set chOff(value: string) {
    this.setAttribute('charoff', value)
  }

  get vAlign() {
    return this.getAttribute('valign') ?? ''
  }
  set vAlign(value: string) {
    this.setAttribute('valign', value)
  }

  insertCell() { return null }
  deleteCell() {}
}
