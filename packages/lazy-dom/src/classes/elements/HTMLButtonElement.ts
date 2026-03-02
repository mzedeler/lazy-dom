import { HTMLElement } from "./HTMLElement"

export class HTMLButtonElement extends HTMLElement {
  get type() {
    return this.getAttribute('type') ?? 'submit'
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get value() {
    return this.getAttribute('value') ?? ''
  }
  set value(val: string) {
    this.setAttribute('value', val)
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get formAction() {
    return this.getAttribute('formaction') ?? ''
  }
  set formAction(value: string) {
    this.setAttribute('formaction', value)
  }

  get formEnctype() {
    return this.getAttribute('formenctype') ?? ''
  }
  set formEnctype(value: string) {
    this.setAttribute('formenctype', value)
  }

  get formMethod() {
    return this.getAttribute('formmethod') ?? ''
  }
  set formMethod(value: string) {
    this.setAttribute('formmethod', value)
  }

  get formTarget() {
    return this.getAttribute('formtarget') ?? ''
  }
  set formTarget(value: string) {
    this.setAttribute('formtarget', value)
  }

  get form() {
    return null
  }
}
