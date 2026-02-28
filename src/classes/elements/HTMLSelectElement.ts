import { HTMLElement } from "./HTMLElement"

export class HTMLSelectElement extends HTMLElement {
  get type() {
    return this.hasAttribute('multiple') ? 'select-multiple' : 'select-one'
  }

  get selectedIndex() {
    return -1
  }
  set selectedIndex(_value: number) {
    // minimal implementation
  }

  get value() {
    return this.getAttribute('value') ?? ''
  }
  set value(v: string) {
    this.setAttribute('value', v)
  }

  get length() {
    return 0
  }

  get form() {
    return null
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get multiple() {
    return this.hasAttribute('multiple')
  }
  set multiple(value: boolean) {
    if (value) this.setAttribute('multiple', '')
    else this.removeAttribute('multiple')
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get size() {
    const val = this.getAttribute('size')
    return val ? parseInt(val, 10) : 0
  }
  set size(value: number) {
    this.setAttribute('size', String(value))
  }

  get tabIndex() {
    const val = this.getAttribute('tabindex')
    return val ? parseInt(val, 10) : 0
  }
  set tabIndex(value: number) {
    this.setAttribute('tabindex', String(value))
  }

  add() {}
  remove() {}
}
