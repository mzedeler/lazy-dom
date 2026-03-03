import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLHeadingElement extends HTMLElement {
  declare align: string
}
defineStringReflections(HTMLHeadingElement.prototype, [
  ['align', 'align'],
])
