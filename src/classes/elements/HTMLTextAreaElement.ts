import { HTMLElement } from "./HTMLElement"

export class HTMLTextAreaElement extends HTMLElement {
  private _value = ''

  get form() {
    return null
  }

  get defaultValue() {
    return this.textContent ?? ''
  }
  set defaultValue(value: string) {
    this.textContent = value
  }

  get accessKey() {
    return this.getAttribute('accesskey') ?? ''
  }
  set accessKey(value: string) {
    this.setAttribute('accesskey', value)
  }

  get cols() {
    const val = this.getAttribute('cols')
    return val ? parseInt(val, 10) : 20
  }
  set cols(value: number) {
    this.setAttribute('cols', String(value))
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get readOnly() {
    return this.hasAttribute('readonly')
  }
  set readOnly(value: boolean) {
    if (value) this.setAttribute('readonly', '')
    else this.removeAttribute('readonly')
  }

  get rows() {
    const val = this.getAttribute('rows')
    return val ? parseInt(val, 10) : 2
  }
  set rows(value: number) {
    this.setAttribute('rows', String(value))
  }

  get tabIndex() {
    const val = this.getAttribute('tabindex')
    return val ? parseInt(val, 10) : 0
  }
  set tabIndex(value: number) {
    this.setAttribute('tabindex', String(value))
  }

  get type() {
    return 'textarea'
  }

  get value() {
    return this._value || this.defaultValue
  }
  set value(v: string) {
    this._value = v
  }
}
