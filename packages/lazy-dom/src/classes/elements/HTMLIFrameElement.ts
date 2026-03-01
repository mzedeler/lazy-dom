import { HTMLElement } from "./HTMLElement"

export class HTMLIFrameElement extends HTMLElement {
  get align() {
    return this.getAttribute('align') ?? ''
  }
  set align(value: string) {
    this.setAttribute('align', value)
  }

  get frameBorder() {
    return this.getAttribute('frameborder') ?? ''
  }
  set frameBorder(value: string) {
    this.setAttribute('frameborder', value)
  }

  get height() {
    return this.getAttribute('height') ?? ''
  }
  set height(value: string) {
    this.setAttribute('height', value)
  }

  get longDesc() {
    return this.getAttribute('longdesc') ?? ''
  }
  set longDesc(value: string) {
    this.setAttribute('longdesc', value)
  }

  get marginHeight() {
    return this.getAttribute('marginheight') ?? ''
  }
  set marginHeight(value: string) {
    this.setAttribute('marginheight', value)
  }

  get marginWidth() {
    return this.getAttribute('marginwidth') ?? ''
  }
  set marginWidth(value: string) {
    this.setAttribute('marginwidth', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get scrolling() {
    return this.getAttribute('scrolling') ?? ''
  }
  set scrolling(value: string) {
    this.setAttribute('scrolling', value)
  }

  get src() {
    return this.getAttribute('src') ?? ''
  }
  set src(value: string) {
    this.setAttribute('src', value)
  }

  get width() {
    return this.getAttribute('width') ?? ''
  }
  set width(value: string) {
    this.setAttribute('width', value)
  }
}
