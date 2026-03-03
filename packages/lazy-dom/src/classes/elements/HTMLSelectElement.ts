import { HTMLElement } from "./HTMLElement"
import { HTMLOptionElement } from "./HTMLOptionElement"
import { Node } from "../Node/Node"
import { Element } from "../Element"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

function collectOptions(node: Node): HTMLOptionElement[] {
  const result: HTMLOptionElement[] = []
  const children = node.childNodes
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child instanceof HTMLOptionElement) {
      result.push(child)
    } else if (child instanceof Element) {
      // Recurse into optgroup elements
      result.push(...collectOptions(child))
    }
  }
  return result
}

export class HTMLSelectElement extends HTMLElement {
  declare name: string
  declare disabled: boolean
  declare multiple: boolean
  declare size: number
  declare tabIndex: number

  get type() {
    return this.hasAttribute('multiple') ? 'select-multiple' : 'select-one'
  }

  get selectedIndex() {
    const opts = collectOptions(this)
    for (let i = 0; i < opts.length; i++) {
      if (opts[i].selected) return i
    }
    // Per spec: single-select with size <= 1 defaults to first option
    // With size > 1 or multiple, no default selection
    const size = this.size
    if (!this.hasAttribute('multiple') && (size <= 1) && opts.length > 0) return 0
    return -1
  }
  set selectedIndex(value: number) {
    const opts = collectOptions(this)
    for (let i = 0; i < opts.length; i++) {
      opts[i].selected = i === value
    }
  }

  get value(): string {
    const idx = this.selectedIndex
    if (idx < 0) return ''
    const opts = collectOptions(this)
    return opts[idx]?.value ?? ''
  }
  set value(v: string) {
    const opts = collectOptions(this)
    for (let i = 0; i < opts.length; i++) {
      opts[i].selected = opts[i].value === v
    }
  }

  get length() {
    return collectOptions(this).length
  }

  get options(): HTMLOptionElement[] {
    return collectOptions(this)
  }

  get form() {
    return null
  }

  add() {}
  remove() {}
}
defineStringReflections(HTMLSelectElement.prototype, [
  ['name', 'name'],
])
defineBooleanReflections(HTMLSelectElement.prototype, [
  ['disabled', 'disabled'],
  ['multiple', 'multiple'],
])
defineNumericReflections(HTMLSelectElement.prototype, [
  ['size', 'size'],
  ['tabIndex', 'tabindex'],
])
