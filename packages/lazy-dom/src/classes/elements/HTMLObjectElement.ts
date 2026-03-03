import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLObjectElement extends HTMLElement {
  declare code: string
  declare align: string
  declare archive: string
  declare border: string
  declare codeBase: string
  declare codeType: string
  declare data: string
  declare declare: boolean
  declare height: string
  declare hspace: number
  declare name: string
  declare standby: string
  declare type: string
  declare useMap: string
  declare vspace: number
  declare width: string

  declare tabIndex: number

  get form() {
    return null
  }
}
defineStringReflections(HTMLObjectElement.prototype, [
  ['code', 'code'],
  ['align', 'align'],
  ['archive', 'archive'],
  ['border', 'border'],
  ['codeBase', 'codebase'],
  ['codeType', 'codetype'],
  ['data', 'data'],
  ['height', 'height'],
  ['name', 'name'],
  ['standby', 'standby'],
  ['type', 'type'],
  ['useMap', 'usemap'],
  ['width', 'width'],
])
defineBooleanReflections(HTMLObjectElement.prototype, [
  ['declare', 'declare'],
])
defineNumericReflections(HTMLObjectElement.prototype, [
  ['hspace', 'hspace'],
  ['tabIndex', 'tabindex'],
  ['vspace', 'vspace'],
])
