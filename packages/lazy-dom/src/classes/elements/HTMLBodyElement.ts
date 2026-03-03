import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLBodyElement extends HTMLElement {
  declare aLink: string
  declare background: string
  declare bgColor: string
  declare link: string
  declare text: string
  declare vLink: string

  constructor() {
    super()
    this.elementStore.tagName = () => 'body'
  }
}
defineStringReflections(HTMLBodyElement.prototype, [
  ['aLink', 'alink'],
  ['background', 'background'],
  ['bgColor', 'bgcolor'],
  ['link', 'link'],
  ['text', 'text'],
  ['vLink', 'vlink'],
])
