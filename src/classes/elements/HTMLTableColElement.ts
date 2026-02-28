import { HTMLElement } from "./HTMLElement"

export class HTMLTableColElement extends HTMLElement {
  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
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

  get span() {
    const val = this.getAttribute('span')
    return val ? parseInt(val, 10) : 1
  }
  set span(value: number) {
    this.setAttribute('span', String(value))
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
