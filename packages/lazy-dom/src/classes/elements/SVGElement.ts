import { Element } from "../Element"

export class SVGElement extends Element {
  get tabIndex() {
    const val = this.getAttribute('tabindex')
    return val !== null ? parseInt(val, 10) : -1
  }
  set tabIndex(value: number) {
    this.setAttribute('tabindex', String(value))
  }

  get className() {
    return this.getAttribute('class') ?? ''
  }
  set className(value: string) {
    this.setAttribute('class', value)
  }
}
