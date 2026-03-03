import { HTMLElement } from "./HTMLElement"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLUListElement extends HTMLElement {
  declare compact: boolean
  declare type: string
}
defineStringReflections(HTMLUListElement.prototype, [
  ['type', 'type'],
])
defineBooleanReflections(HTMLUListElement.prototype, [
  ['compact', 'compact'],
])
