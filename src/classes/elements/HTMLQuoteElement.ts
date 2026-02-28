import { HTMLElement } from "./HTMLElement"

export class HTMLQuoteElement extends HTMLElement {
  get cite() {
    return this.getAttribute('cite') ?? ''
  }
  set cite(value: string) {
    this.setAttribute('cite', value)
  }
}
