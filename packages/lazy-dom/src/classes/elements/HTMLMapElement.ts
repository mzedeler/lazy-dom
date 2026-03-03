import { HTMLElement } from "./HTMLElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLMapElement extends HTMLElement {
  declare name: string
}
defineStringReflections(HTMLMapElement.prototype, [
  ['name', 'name'],
])
