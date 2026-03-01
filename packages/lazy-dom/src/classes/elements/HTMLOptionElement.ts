import { HTMLElement } from "./HTMLElement"

export class HTMLOptionElement extends HTMLElement {
  private _selected = false
  private _value = ''

  get form() {
    return null
  }

  get defaultSelected() {
    return this.hasAttribute('selected')
  }
  set defaultSelected(value: boolean) {
    if (value) this.setAttribute('selected', '')
    else this.removeAttribute('selected')
  }

  get text() {
    return this.textContent ?? ''
  }

  get index() {
    return 0
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get label() {
    return this.getAttribute('label') ?? ''
  }
  set label(value: string) {
    this.setAttribute('label', value)
  }

  get selected() {
    return this._selected || this.defaultSelected
  }
  set selected(value: boolean) {
    this._selected = value
  }

  get value() {
    const val = this.getAttribute('value')
    if (val !== null) return val
    return this._value || this.textContent || ''
  }
  set value(v: string) {
    this._value = v
    this.setAttribute('value', v)
  }
}
