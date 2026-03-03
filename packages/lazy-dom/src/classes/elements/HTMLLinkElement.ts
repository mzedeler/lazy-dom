import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLLinkElement extends HTMLElement {
  declare charset: string
  declare disabled: boolean
  declare href: string
  declare hreflang: string
  declare media: string
  declare rel: string
  declare rev: string
  declare target: string
  declare type: string
}
defineStringReflections(HTMLLinkElement.prototype, [
  ['charset', 'charset'],
  ['href', 'href'],
  ['hreflang', 'hreflang'],
  ['media', 'media'],
  ['rel', 'rel'],
  ['rev', 'rev'],
  ['target', 'target'],
  ['type', 'type'],
])
defineBooleanReflections(HTMLLinkElement.prototype, [
  ['disabled', 'disabled'],
])
