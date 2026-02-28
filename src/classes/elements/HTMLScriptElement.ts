import { HTMLElement } from "./HTMLElement"

export class HTMLScriptElement extends HTMLElement {
  get text() {
    return this.textContent ?? ''
  }
  set text(value: string) {
    this.textContent = value
  }

  get charset() {
    return this.getAttribute('charset') ?? ''
  }
  set charset(value: string) {
    this.setAttribute('charset', value)
  }

  get defer() {
    return this.hasAttribute('defer')
  }
  set defer(value: boolean) {
    if (value) this.setAttribute('defer', '')
    else this.removeAttribute('defer')
  }

  get event() {
    return this.getAttribute('event') ?? ''
  }
  set event(value: string) {
    this.setAttribute('event', value)
  }

  get htmlFor() {
    return this.getAttribute('for') ?? ''
  }
  set htmlFor(value: string) {
    this.setAttribute('for', value)
  }

  get src() {
    return this.getAttribute('src') ?? ''
  }
  set src(value: string) {
    this.setAttribute('src', value)
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }
}
