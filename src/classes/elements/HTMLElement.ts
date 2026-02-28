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
}
