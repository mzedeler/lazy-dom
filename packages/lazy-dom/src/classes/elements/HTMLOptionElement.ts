import { HTMLElement } from "./HTMLElement"
import type { Element } from "../Element"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLOptionElement extends HTMLElement {
  private _dirtySelected = false
  private _selected = false
  private _value = ''
  declare label: string
  declare disabled: boolean

  get form() {
    return this.closest('form')
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

  get selected() {
    if (this._dirtySelected) return this._selected
    if (this.defaultSelected) return true
    // Browser default: in a single-select (size=1) with no selected attribute on any option,
    // the first non-disabled option is implicitly selected.
    // When size > 1, no option is auto-selected.
    const select = this._findParentSelect()
    if (!select || select.hasAttribute('multiple')) return false
    const size = select.getAttribute('size')
    if (size !== null && parseInt(size, 10) > 1) return false
    const options = select.querySelectorAll('option')
    // Check if any sibling has the selected attribute
    for (let i = 0; i < options.length; i++) {
      const opt = options[i]
      if (opt instanceof HTMLOptionElement && (opt._dirtySelected || opt.defaultSelected)) {
        return false
      }
    }
    // No option is explicitly selected — first non-disabled option wins
    for (let i = 0; i < options.length; i++) {
      const opt = options[i]
      if (opt instanceof HTMLOptionElement && !opt.disabled) {
        return opt === this
      }
    }
    return false
  }
  set selected(value: boolean) {
    this._dirtySelected = true
    this._selected = value
    // In a single-select, selecting one option must deselect siblings
    if (value) {
      this._deselectSiblings()
    }
  }

  /** Deselect other option elements in the same single-select parent. */
  private _deselectSiblings() {
    const select = this._findParentSelect()
    if (!select || select.hasAttribute('multiple')) return
    const options = select.querySelectorAll('option')
    for (let i = 0; i < options.length; i++) {
      const opt = options[i]
      if (opt !== this && opt instanceof HTMLOptionElement) {
        opt._dirtySelected = true
        opt._selected = false
      }
    }
  }

  /** Walk up the tree to find the parent <select> element. */
  private _findParentSelect(): Element | null {
    return this.closest('select')
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
defineStringReflections(HTMLOptionElement.prototype, [
  ['label', 'label'],
])
defineBooleanReflections(HTMLOptionElement.prototype, [
  ['disabled', 'disabled'],
])
