import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLLIElement extends HTMLElement {
  declare type: string
  declare value: number
}
defineStringReflections(HTMLLIElement.prototype, [
  ['type', 'type'],
])
defineNumericReflections(HTMLLIElement.prototype, [
  ['value', 'value'],
])
