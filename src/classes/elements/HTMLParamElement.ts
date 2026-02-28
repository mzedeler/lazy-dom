import { HTMLElement } from "./HTMLElement"

export class HTMLParamElement extends HTMLElement {
  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }

  get value() {
    return this.getAttribute('value') ?? ''
  }
  set value(value: string) {
    this.setAttribute('value', value)
  }

  get valueType() {
    return this.getAttribute('valuetype') ?? ''
  }
  set valueType(value: string) {
    this.setAttribute('valuetype', value)
  }
}
