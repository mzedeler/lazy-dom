import { HTMLElement } from "./HTMLElement"

export class HTMLTableElement extends HTMLElement {
  get caption() {
    return null
  }

  get tHead() {
    return null
  }

  get tFoot() {
    return null
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

  get border() {
    return this.getAttribute('border') ?? ''
  }
  set border(value: string) {
    this.setAttribute('border', value)
  }

  get cellPadding() {
    return this.getAttribute('cellpadding') ?? ''
  }
  set cellPadding(value: string) {
    this.setAttribute('cellpadding', value)
  }

  get cellSpacing() {
    return this.getAttribute('cellspacing') ?? ''
  }
  set cellSpacing(value: string) {
    this.setAttribute('cellspacing', value)
  }

  get frame() {
    return this.getAttribute('frame') ?? ''
  }
  set frame(value: string) {
    this.setAttribute('frame', value)
  }

  get rules() {
    return this.getAttribute('rules') ?? ''
  }
  set rules(value: string) {
    this.setAttribute('rules', value)
  }

  get summary() {
    return this.getAttribute('summary') ?? ''
  }
  set summary(value: string) {
    this.setAttribute('summary', value)
  }

  get width() {
    return this.getAttribute('width') ?? ''
  }
  set width(value: string) {
    this.setAttribute('width', value)
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
