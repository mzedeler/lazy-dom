import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLTextAreaElement extends HTMLElement {
  private _value = ''
  private _selectionStart: number = 0
  private _selectionEnd: number = 0
  private _selectionDirection: 'forward' | 'backward' | 'none' = 'none'

  declare name: string
  declare disabled: boolean
  declare readOnly: boolean
  declare cols: number
  declare rows: number
  declare tabIndex: number

  get form() {
    return null
  }

  get defaultValue() {
    return this.textContent ?? ''
  }
  set defaultValue(value: string) {
    this.textContent = value
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
defineStringReflections(HTMLTextAreaElement.prototype, [
  ['name', 'name'],
])
defineBooleanReflections(HTMLTextAreaElement.prototype, [
  ['disabled', 'disabled'],
  ['readOnly', 'readonly'],
])
defineNumericReflections(HTMLTextAreaElement.prototype, [
  ['cols', 'cols', 20],
  ['rows', 'rows', 2],
  ['tabIndex', 'tabindex'],
])
