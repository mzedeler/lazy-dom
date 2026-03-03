import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLImageElement extends HTMLElement {
  declare alt: string
  declare name: string
  declare width: number
  declare height: number
  declare align: string
  declare longDesc: string
  declare isMap: boolean
  declare useMap: string
  declare border: string
  declare hspace: number
  declare vspace: number
  declare lowSrc: string

  get src() {
    const raw = this.getAttribute('src')
    if (raw === null) return ''
    try {
      const loc = this.ownerDocument?.defaultView?.location
      const base = (typeof loc === 'object' ? loc?.href : loc) ?? 'http://localhost/'
      return new URL(raw, base).href
    } catch {
      return raw
    }
  }
  set src(value: string) {
    this.setAttribute('src', value)
  }
}
defineStringReflections(HTMLImageElement.prototype, [
  ['alt', 'alt'],
  ['name', 'name'],
  ['align', 'align'],
  ['longDesc', 'longdesc'],
  ['useMap', 'usemap'],
  ['border', 'border'],
  ['lowSrc', 'lowsrc'],
])
defineBooleanReflections(HTMLImageElement.prototype, [
  ['isMap', 'ismap'],
])
defineNumericReflections(HTMLImageElement.prototype, [
  ['width', 'width'],
  ['height', 'height'],
  ['hspace', 'hspace'],
  ['vspace', 'vspace'],
])
