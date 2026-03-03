import { HTMLElement } from "./HTMLElement"

export class HTMLTextAreaElement extends HTMLElement {
  private _value = ''
  private _selectionStart: number = 0
  private _selectionEnd: number = 0
  private _selectionDirection: 'forward' | 'backward' | 'none' = 'none'

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
}
