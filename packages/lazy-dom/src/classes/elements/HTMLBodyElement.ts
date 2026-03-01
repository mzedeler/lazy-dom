import { HTMLElement } from "./HTMLElement"

export class HTMLBodyElement extends HTMLElement {
  constructor() {
    super()
    this.elementStore.tagName = () => 'body'
  }

  get aLink() {
    return this.getAttribute('alink') ?? ''
  }
  set aLink(value: string) {
    this.setAttribute('alink', value)
  }

  get background() {
    return this.getAttribute('background') ?? ''
  }
  set background(value: string) {
    this.setAttribute('background', value)
  }

  get bgColor() {
    return this.getAttribute('bgcolor') ?? ''
  }
  set bgColor(value: string) {
    this.setAttribute('bgcolor', value)
  }

  get link() {
    return this.getAttribute('link') ?? ''
  }
  set link(value: string) {
    this.setAttribute('link', value)
  }

  get text() {
    return this.getAttribute('text') ?? ''
  }
  set text(value: string) {
    this.setAttribute('text', value)
  }

  get vLink() {
    return this.getAttribute('vlink') ?? ''
  }
  set vLink(value: string) {
    this.setAttribute('vlink', value)
  }
}
