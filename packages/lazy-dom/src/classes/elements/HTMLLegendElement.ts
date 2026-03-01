import { HTMLElement } from "./HTMLElement"

export class HTMLLegendElement extends HTMLElement {
  get form() {
    return null
  }

  get accessKey() {
    return this.getAttribute('accesskey') ?? ''
  }
  set accessKey(value: string) {
    this.setAttribute('accesskey', value)
  }

  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }
}
