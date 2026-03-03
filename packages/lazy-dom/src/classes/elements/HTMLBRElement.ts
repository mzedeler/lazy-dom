import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLBRElement extends HTMLElement {
  declare clear: string
}
defineStringReflections(HTMLBRElement.prototype, [
  ['clear', 'clear'],
])
