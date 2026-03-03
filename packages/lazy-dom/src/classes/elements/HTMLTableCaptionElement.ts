import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLTableCaptionElement extends HTMLElement {
  declare align: string
}
defineStringReflections(HTMLTableCaptionElement.prototype, [
  ['align', 'align'],
])
