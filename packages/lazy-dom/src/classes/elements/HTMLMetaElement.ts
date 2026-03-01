import { HTMLElement } from "./HTMLElement"

export class HTMLMetaElement extends HTMLElement {
  get content() {
    return this.getAttribute('content') ?? ''
  }
  set content(value: string) {
    this.setAttribute('content', value)
  }

  get httpEquiv() {
    return this.getAttribute('http-equiv') ?? ''
  }
  set httpEquiv(value: string) {
    this.setAttribute('http-equiv', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get scheme() {
    return this.getAttribute('scheme') ?? ''
  }
  set scheme(value: string) {
    this.setAttribute('scheme', value)
  }
}
