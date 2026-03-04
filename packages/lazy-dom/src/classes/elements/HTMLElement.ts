import { Element } from "../Element"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLElement extends Element {
  declare id: string
  declare title: string
  declare lang: string
  declare dir: string
  declare className: string
  declare accessKey: string
  declare tabIndex: number
  declare autofocus: boolean

  get draggable() {
    return this.getAttribute('draggable') === 'true'
  }
  set draggable(value: boolean) {
    this.setAttribute('draggable', String(value))
  }

  get contentEditable(): string {
    return this.getAttribute('contenteditable') ?? 'inherit'
  }
  set contentEditable(value: string) {
    this.setAttribute('contenteditable', value)
  }

  get isContentEditable(): boolean {
    const val = this.getAttribute('contenteditable')
    if (val === 'true' || val === '') return true
    if (val === 'false') return false
    // 'inherit' — walk up the tree
    const parent = this.parentElement
    if (parent && 'isContentEditable' in parent) {
      return (parent as HTMLElement).isContentEditable
    }
    return false
  }

  get spellcheck(): boolean {
    const val = this.getAttribute('spellcheck')
    if (val === 'false') return false
    return true
  }
  set spellcheck(value: boolean) {
    this.setAttribute('spellcheck', String(value))
  }

  get innerText(): string {
    return this.textContent ?? ''
  }
  set innerText(value: string) {
    this.textContent = value
  }

  get offsetWidth(): number { return 0 }
  get offsetHeight(): number { return 0 }
  get offsetTop(): number { return 0 }
  get offsetLeft(): number { return 0 }
  get offsetParent(): Element | null { return null }
}
defineStringReflections(HTMLElement.prototype, [
  ['id', 'id'],
  ['title', 'title'],
  ['lang', 'lang'],
  ['dir', 'dir'],
  ['className', 'class'],
  ['accessKey', 'accesskey'],
])
defineBooleanReflections(HTMLElement.prototype, [
  ['autofocus', 'autofocus'],
])
defineNumericReflections(HTMLElement.prototype, [
  ['tabIndex', 'tabindex', -1],
])
