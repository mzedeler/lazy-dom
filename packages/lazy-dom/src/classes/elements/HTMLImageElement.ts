import { HTMLElement } from "./HTMLElement"

export class HTMLImageElement extends HTMLElement {
  get src() {
    return this.getAttribute('src') ?? ''
  }
  set src(value: string) {
    this.setAttribute('src', value)
  }

  get alt() {
    return this.getAttribute('alt') ?? ''
  }
  set alt(value: string) {
    this.setAttribute('alt', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get width() {
    const val = this.getAttribute('width')
    return val !== null ? parseInt(val, 10) : 0
  }
  set width(value: number) {
    this.setAttribute('width', String(value))
  }

  get height() {
    const val = this.getAttribute('height')
    return val !== null ? parseInt(val, 10) : 0
  }
  set height(value: number) {
    this.setAttribute('height', String(value))
  }

  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }

  get longDesc() {
    return this.getAttribute('longdesc') ?? ''
  }
  set longDesc(value: string) {
    this.setAttribute('longdesc', value)
  }

  get isMap() {
    return this.hasAttribute('ismap')
  }
  set isMap(value: boolean) {
    if (value) this.setAttribute('ismap', '')
    else this.removeAttribute('ismap')
  }

  get useMap() {
    return this.getAttribute('usemap') ?? ''
  }
  set useMap(value: string) {
    this.setAttribute('usemap', value)
  }

  get border() {
    return this.getAttribute('border') ?? ''
  }
  set border(value: string) {
    this.setAttribute('border', value)
  }

  get hspace() {
    const val = this.getAttribute('hspace')
    return val !== null ? parseInt(val, 10) : 0
  }
  set hspace(value: number) {
    this.setAttribute('hspace', String(value))
  }

  get vspace() {
    const val = this.getAttribute('vspace')
    return val !== null ? parseInt(val, 10) : 0
  }
  set vspace(value: number) {
    this.setAttribute('vspace', String(value))
  }

  get lowSrc() {
    return this.getAttribute('lowsrc') ?? ''
  }
  set lowSrc(value: string) {
    this.setAttribute('lowsrc', value)
  }
}
