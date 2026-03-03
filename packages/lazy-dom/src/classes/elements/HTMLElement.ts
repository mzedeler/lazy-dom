import { Element } from "../Element"

export class HTMLElement extends Element {
  get id() {
    return this.getAttribute('id') ?? ''
  }
  set id(value: string) {
    this.setAttribute('id', value)
  }

  get title() {
    return this.getAttribute('title') ?? ''
  }
  set title(value: string) {
    this.setAttribute('title', value)
  }

  get lang() {
    return this.getAttribute('lang') ?? ''
  }
  set lang(value: string) {
    this.setAttribute('lang', value)
  }

  get dir() {
    return this.getAttribute('dir') ?? ''
  }
  set dir(value: string) {
    this.setAttribute('dir', value)
  }

  get className() {
    return this.getAttribute('class') ?? ''
  }
  set className(value: string) {
    this.setAttribute('class', value)
  }

  get tabIndex() {
    const val = this.getAttribute('tabindex')
    return val !== null ? parseInt(val, 10) : -1
  }
  set tabIndex(value: number) {
    this.setAttribute('tabindex', String(value))
  }

  get accessKey() {
    return this.getAttribute('accesskey') ?? ''
  }
  set accessKey(value: string) {
    this.setAttribute('accesskey', value)
  }

  get draggable() {
    return this.getAttribute('draggable') === 'true'
  }
  set draggable(value: boolean) {
    this.setAttribute('draggable', String(value))
  }

  get autofocus() {
    return this.hasAttribute('autofocus')
  }
  set autofocus(value: boolean) {
    if (value) {
      this.setAttribute('autofocus', '')
    } else {
      this.removeAttribute('autofocus')
    }
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

  get hidden(): boolean {
    return this.hasAttribute('hidden')
  }
  set hidden(value: boolean) {
    if (value) {
      this.setAttribute('hidden', '')
    } else {
      this.removeAttribute('hidden')
    }
  }

  get spellcheck(): boolean {
    const val = this.getAttribute('spellcheck')
    if (val === 'false') return false
    return true
  }
  set spellcheck(value: boolean) {
    this.setAttribute('spellcheck', String(value))
  }

  get role(): string {
    return this.getAttribute('role') ?? ''
  }
  set role(value: string) {
    this.setAttribute('role', value)
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
