import { HTMLElement } from "./HTMLElement"

export class HTMLTableCellElement extends HTMLElement {
  get cellIndex() {
    return 0
  }

  get abbr() {
    return this.getAttribute('abbr') ?? ''
  }
  set abbr(value: string) {
    this.setAttribute('abbr', value)
  }

  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }

  get axis() {
    return this.getAttribute('axis') ?? ''
  }
  set axis(value: string) {
    this.setAttribute('axis', value)
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

  get colSpan() {
    const val = this.getAttribute('colspan')
    return val ? parseInt(val, 10) : 1
  }
  set colSpan(value: number) {
    this.setAttribute('colspan', String(value))
  }

  get headers() {
    return this.getAttribute('headers') ?? ''
  }
  set headers(value: string) {
    this.setAttribute('headers', value)
  }

  get height() {
    return this.getAttribute('height') ?? ''
  }
  set height(value: string) {
    this.setAttribute('height', value)
  }

  get noWrap() {
    return this.hasAttribute('nowrap')
  }
  set noWrap(value: boolean) {
    if (value) this.setAttribute('nowrap', '')
    else this.removeAttribute('nowrap')
  }

  get rowSpan() {
    const val = this.getAttribute('rowspan')
    return val ? parseInt(val, 10) : 1
  }
  set rowSpan(value: number) {
    this.setAttribute('rowspan', String(value))
  }

  get scope() {
    return this.getAttribute('scope') ?? ''
  }
  set scope(value: string) {
    this.setAttribute('scope', value)
  }

  get vAlign() {
    return this.getAttribute('valign') ?? ''
  }
  set vAlign(value: string) {
    this.setAttribute('valign', value)
  }

  get width() {
    return this.getAttribute('width') ?? ''
  }
  set width(value: string) {
    this.setAttribute('width', value)
  }
}
