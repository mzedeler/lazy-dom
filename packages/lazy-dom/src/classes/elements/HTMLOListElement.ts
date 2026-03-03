import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections, defineNumericReflections } from "../../utils/reflectAttributes"

export class HTMLOListElement extends HTMLElement {
  declare compact: boolean
  declare start: number
  declare type: string
}
defineStringReflections(HTMLOListElement.prototype, [
  ['type', 'type'],
])
defineBooleanReflections(HTMLOListElement.prototype, [
  ['compact', 'compact'],
])
defineNumericReflections(HTMLOListElement.prototype, [
  ['start', 'start'],
])
