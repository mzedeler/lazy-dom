import { HTMLElement } from "./HTMLElement"

export class HTMLDListElement extends HTMLElement {
  get compact() {
    return this.hasAttribute('compact')
  }
  set compact(value: boolean) {
    if (value) this.setAttribute('compact', '')
    else this.removeAttribute('compact')
  }
}
