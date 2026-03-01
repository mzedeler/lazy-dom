import { HTMLElement } from "./HTMLElement"

export class HTMLFormElement extends HTMLElement {
  get action() {
    return this.getAttribute('action') ?? ''
  }
  set action(value: string) {
    this.setAttribute('action', value)
  }

  get method() {
    return this.getAttribute('method') ?? 'get'
  }
  set method(value: string) {
    this.setAttribute('method', value)
  }

  get enctype() {
    return this.getAttribute('enctype') ?? 'application/x-www-form-urlencoded'
  }
  set enctype(value: string) {
    this.setAttribute('enctype', value)
  }

  get target() {
    return this.getAttribute('target') ?? ''
  }
  set target(value: string) {
    this.setAttribute('target', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get acceptCharset() {
    return this.getAttribute('accept-charset') ?? ''
  }
  set acceptCharset(value: string) {
    this.setAttribute('accept-charset', value)
  }

  get length() {
    return 0
  }

  submit() {}
  reset() {}
}
