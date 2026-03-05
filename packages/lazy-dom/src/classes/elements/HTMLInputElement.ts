import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLInputElement extends HTMLElement {
  // Internal "dirty" state — once set programmatically, value/checked
  // diverge from the corresponding content attributes.
  private _dirtyValue = false
  private _value = ''
  private _dirtyChecked = false
  private _checked = false
  private _selectionStart: number = 0
  private _selectionEnd: number = 0
  private _selectionDirection: 'forward' | 'backward' | 'none' = 'none'

  declare name: string
  declare src: string
  declare useMap: string
  declare alt: string
  declare accept: string
  declare align: string
  declare disabled: boolean
  declare readOnly: boolean
  declare maxLength: number
  declare size: number

  get type() {
    return this.getAttribute('type') ?? 'text'
  }
  set type(value: string) {
    this.setAttribute('type', value)
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

  get form() {
    return this.closest('form')
  }

  private _fileList: FileList | null = null

  get files(): FileList | null {
    if (this.type.toLowerCase() !== 'file') return null
    if (!this._fileList) {
      this._fileList = Object.assign([], { item: (_i: number) => null }) as unknown as FileList
    }
    return this._fileList
  }
  set files(_val: FileList | null) {
    // Writable per spec; user-event overrides via Object.defineProperty
  }

  get selectionStart(): number {
    return this._selectionStart
  }
  set selectionStart(val: number) {
    this._selectionStart = val
  }

  get selectionEnd(): number {
    return this._selectionEnd
  }
  set selectionEnd(val: number) {
    this._selectionEnd = val
  }

  get selectionDirection(): 'forward' | 'backward' | 'none' {
    return this._selectionDirection
  }

  setSelectionRange(start: number, end: number, direction: 'forward' | 'backward' | 'none' = 'none') {
    this._selectionStart = start
    this._selectionEnd = end
    this._selectionDirection = direction
  }

  setRangeText(replacement: string, start?: number, end?: number, selectMode?: string) {
    const val = this.value
    const s = start ?? this._selectionStart
    const e = end ?? this._selectionEnd
    this.value = val.slice(0, s) + replacement + val.slice(e)

    switch (selectMode) {
      case 'select':
        this._selectionStart = s
        this._selectionEnd = s + replacement.length
        break
      case 'start':
        this._selectionStart = s
        this._selectionEnd = s
        break
      case 'end':
        this._selectionStart = s + replacement.length
        this._selectionEnd = s + replacement.length
        break
      default: {
        // 'preserve' (default)
        const delta = replacement.length - (e - s)
        this._selectionEnd = this._selectionEnd + delta
        break
      }
    }
  }

  select() {
    this.setSelectionRange(0, this.value.length)
  }

  // Override not needed - Element.click() dispatches 'click' which triggers
  // the checkbox/radio activation behavior in Element.dispatchEvent
}
defineStringReflections(HTMLInputElement.prototype, [
  ['name', 'name'],
  ['src', 'src'],
  ['useMap', 'usemap'],
  ['alt', 'alt'],
  ['accept', 'accept'],
  ['align', 'align'],
])
defineBooleanReflections(HTMLInputElement.prototype, [
  ['disabled', 'disabled'],
  ['readOnly', 'readonly'],
])
defineNumericReflections(HTMLInputElement.prototype, [
  ['maxLength', 'maxlength', -1],
  ['size', 'size', 20],
])
