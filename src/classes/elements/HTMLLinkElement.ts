import { HTMLElement } from "./HTMLElement"

export class HTMLLinkElement extends HTMLElement {
  get charset() {
    return this.getAttribute('charset') ?? ''
  }
  set charset(value: string) {
    this.setAttribute('charset', value)
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get href() {
    return this.getAttribute('href') ?? ''
  }
  set href(value: string) {
    this.setAttribute('href', value)
  }

  get hreflang() {
    return this.getAttribute('hreflang') ?? ''
  }
  set hreflang(value: string) {
    this.setAttribute('hreflang', value)
  }

  get media() {
    return this.getAttribute('media') ?? ''
  }
  set media(value: string) {
    this.setAttribute('media', value)
  }

  get rel() {
    return this.getAttribute('rel') ?? ''
  }
  set rel(value: string) {
    this.setAttribute('rel', value)
  }

  get rev() {
    return this.getAttribute('rev') ?? ''
  }
  set rev(value: string) {
    this.setAttribute('rev', value)
  }

  get target() {
    return this.getAttribute('target') ?? ''
  }
  set target(value: string) {
    this.setAttribute('target', value)
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }
}
