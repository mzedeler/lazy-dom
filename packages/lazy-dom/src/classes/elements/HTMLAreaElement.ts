import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLAreaElement extends HTMLElement {
  declare alt: string
  declare coords: string
  declare href: string
  declare noHref: boolean
  declare shape: string
  declare tabIndex: number
  declare target: string
}
defineStringReflections(HTMLAreaElement.prototype, [
  ['alt', 'alt'],
  ['coords', 'coords'],
  ['href', 'href'],
  ['shape', 'shape'],
  ['target', 'target'],
])
defineBooleanReflections(HTMLAreaElement.prototype, [
  ['noHref', 'nohref'],
])
defineNumericReflections(HTMLAreaElement.prototype, [
  ['tabIndex', 'tabindex'],
])
