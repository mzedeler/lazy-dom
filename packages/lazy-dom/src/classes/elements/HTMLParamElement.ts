import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLParamElement extends HTMLElement {
  declare name: string
  declare type: string
  declare value: string
  declare valueType: string
}
defineStringReflections(HTMLParamElement.prototype, [
  ['name', 'name'],
  ['type', 'type'],
  ['value', 'value'],
  ['valueType', 'valuetype'],
])
