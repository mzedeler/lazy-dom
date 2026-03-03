import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLMetaElement extends HTMLElement {
  declare content: string
  declare httpEquiv: string
  declare name: string
  declare scheme: string
}
defineStringReflections(HTMLMetaElement.prototype, [
  ['content', 'content'],
  ['httpEquiv', 'http-equiv'],
  ['name', 'name'],
  ['scheme', 'scheme'],
])
