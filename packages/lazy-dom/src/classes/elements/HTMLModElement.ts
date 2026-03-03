import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLModElement extends HTMLElement {
  declare cite: string
  declare dateTime: string
}
defineStringReflections(HTMLModElement.prototype, [
  ['cite', 'cite'],
  ['dateTime', 'datetime'],
])
