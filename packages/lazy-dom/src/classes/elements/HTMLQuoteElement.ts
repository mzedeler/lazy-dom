import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLQuoteElement extends HTMLElement {
  declare cite: string
}
defineStringReflections(HTMLQuoteElement.prototype, [
  ['cite', 'cite'],
])
