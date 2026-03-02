import { HTMLElement } from "./HTMLElement"

export class HTMLInputElement extends HTMLElement {
  // Internal "dirty" state — once set programmatically, value/checked
  // diverge from the corresponding content attributes.
  private _dirtyValue = false
  private _value = ''
  private _dirtyChecked = false
  private _checked = false

  get type() {
    return this.getAttribute('type') ?? 'text'
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  // Per DOM spec: value is the element's "value" — once set directly it
  // diverges from the content attribute (which is defaultValue).
  // For checkbox/radio, the default value is "on" per spec.
  get value(): string {
    if (this._dirtyValue) return String(this._value)
    const attr = this.getAttribute('value')
    if (attr !== null) return attr
    const t = this.type.toLowerCase()
    if (t === 'checkbox' || t === 'radio') return 'on'
    return ''
  }
  set value(val: string) {
    this._dirtyValue = true
    this._value = String(val)
  }

  get defaultValue() {
    return this.getAttribute('value') ?? ''
  }
  set defaultValue(val: string) {
    // Use internal setter to bypass any monkey-patching on setAttribute
    this._setAttributeInternal('value', val)
  }

  // Same pattern: checked vs defaultChecked
  get checked() {
    if (this._dirtyChecked) return this._checked
    return this.hasAttribute('checked')
  }
  set checked(val: boolean) {
    this._dirtyChecked = true
    this._checked = val
    // Radio group mutual exclusion: uncheck siblings with same name
    if (val && this.type.toLowerCase() === 'radio') {
      this._uncheckRadioSiblings()
    }
  }

  /** Uncheck other radio inputs in the same radio button group. */
  private _uncheckRadioSiblings() {
    const name = this.getAttribute('name')
    if (!name) return
    // Radio group scope: radios share a group if they have the same name AND
    // the same form owner (or both have no form owner).
    const form = this.closest('form')
    const root = form ?? this.ownerDocument
    if (!root) return
    const escapedName = name.replace(/([\\!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, '\\$1')
    const radios = root.querySelectorAll(`input[type="radio"][name="${escapedName}"]`)
    for (let i = 0; i < radios.length; i++) {
      const radio = radios[i]
      if (radio !== (this as unknown) && radio instanceof HTMLInputElement) {
        // Only uncheck if in the same radio group (same form ancestor)
        if (radio.closest('form') === form) {
          radio._dirtyChecked = true
          radio._checked = false
        }
      }
    }
  }

  get defaultChecked() {
    return this.hasAttribute('checked')
  }
  set defaultChecked(val: boolean) {
    // Use internal setter/remover to bypass any monkey-patching on setAttribute/removeAttribute
    if (val) this._setAttributeInternal('checked', '')
    else this._removeAttributeInternal('checked')
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get readOnly() {
    return this.hasAttribute('readonly')
  }
  set readOnly(val: boolean) {
    if (val) this.setAttribute('readonly', '')
    else this.removeAttribute('readonly')
  }

  get maxLength() {
    const val = this.getAttribute('maxlength')
    return val !== null ? parseInt(val, 10) : -1
  }
  set maxLength(val: number) {
    this.setAttribute('maxlength', String(val))
  }

  get size() {
    const val = this.getAttribute('size')
    return val !== null ? parseInt(val, 10) : 20
  }
  set size(val: number) {
    this.setAttribute('size', String(val))
  }

  get src() {
    return this.getAttribute('src') ?? ''
  }
  set src(val: string) {
    this.setAttribute('src', val)
  }

  get useMap() {
    return this.getAttribute('usemap') ?? ''
  }
  set useMap(val: string) {
    this.setAttribute('usemap', val)
  }

  get alt() {
    return this.getAttribute('alt') ?? ''
  }
  set alt(val: string) {
    this.setAttribute('alt', val)
  }

  get accept() {
    return this.getAttribute('accept') ?? ''
  }
  set accept(val: string) {
    this.setAttribute('accept', val)
  }

  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(val: string) {
    this.setAttribute('align', val)
  }

  get form() {
    return null
  }

  select() {}

  // Override not needed - Element.click() dispatches 'click' which triggers
  // the checkbox/radio activation behavior in Element.dispatchEvent
}
