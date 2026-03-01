import { HTMLElement } from "./HTMLElement"

export class HTMLObjectElement extends HTMLElement {
  get form() {
    return null
  }

  get code() {
    return this.getAttribute('code') ?? ''
  }
  set code(value: string) {
    this.setAttribute('code', value)
  }

  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }

  get archive() {
    return this.getAttribute('archive') ?? ''
  }
  set archive(value: string) {
    this.setAttribute('archive', value)
  }

  get border() {
    return this.getAttribute('border') ?? ''
  }
  set border(value: string) {
    this.setAttribute('border', value)
  }

  get codeBase() {
    return this.getAttribute('codebase') ?? ''
  }
  set codeBase(value: string) {
    this.setAttribute('codebase', value)
  }

  get codeType() {
    return this.getAttribute('codetype') ?? ''
  }
  set codeType(value: string) {
    this.setAttribute('codetype', value)
  }

  get data() {
    return this.getAttribute('data') ?? ''
  }
  set data(value: string) {
    this.setAttribute('data', value)
  }

  get declare() {
    return this.hasAttribute('declare')
  }
  set declare(value: boolean) {
    if (value) this.setAttribute('declare', '')
    else this.removeAttribute('declare')
  }

  get height() {
    return this.getAttribute('height') ?? ''
  }
  set height(value: string) {
    this.setAttribute('height', value)
  }

  get hspace() {
    const val = this.getAttribute('hspace')
    return val ? parseInt(val, 10) : 0
  }
  set hspace(value: number) {
    this.setAttribute('hspace', String(value))
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get standby() {
    return this.getAttribute('standby') ?? ''
  }
  set standby(value: string) {
    this.setAttribute('standby', value)
  }

  get tabIndex() {
    const val = this.getAttribute('tabindex')
    return val ? parseInt(val, 10) : 0
  }
  set tabIndex(value: number) {
    this.setAttribute('tabindex', String(value))
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get useMap() {
    return this.getAttribute('usemap') ?? ''
  }
  set useMap(value: string) {
    this.setAttribute('usemap', value)
  }

  get vspace() {
    const val = this.getAttribute('vspace')
    return val ? parseInt(val, 10) : 0
  }
  set vspace(value: number) {
    this.setAttribute('vspace', String(value))
  }

  get width() {
    return this.getAttribute('width') ?? ''
  }
  set width(value: string) {
    this.setAttribute('width', value)
  }
}
