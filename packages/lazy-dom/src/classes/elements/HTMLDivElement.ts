import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLDivElement extends HTMLElement {
  declare align: string
}
defineStringReflections(HTMLDivElement.prototype, [
  ['align', 'align'],
])
