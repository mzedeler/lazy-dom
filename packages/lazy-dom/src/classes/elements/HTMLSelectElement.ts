import { HTMLElement } from "./HTMLElement"
import { HTMLOptionElement } from "./HTMLOptionElement"
import { Node } from "../Node/Node"
import { Element } from "../Element"

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
  get type() {
    return this.hasAttribute('multiple') ? 'select-multiple' : 'select-one'
  }

  get selectedIndex() {
    const opts = collectOptions(this)
    for (let i = 0; i < opts.length; i++) {
      if (opts[i].selected) return i
    }
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
    return collectOptions(this).length
  }

  get options(): HTMLOptionElement[] {
    return collectOptions(this)
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
