import { HTMLElement } from "./HTMLElement"
import { defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLDListElement extends HTMLElement {
  declare compact: boolean
}
defineBooleanReflections(HTMLDListElement.prototype, [
  ['compact', 'compact'],
])
