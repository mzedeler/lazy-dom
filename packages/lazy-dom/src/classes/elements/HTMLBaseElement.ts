import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLBaseElement extends HTMLElement {
  declare href: string
  declare target: string
}
defineStringReflections(HTMLBaseElement.prototype, [
  ['href', 'href'],
  ['target', 'target'],
])
