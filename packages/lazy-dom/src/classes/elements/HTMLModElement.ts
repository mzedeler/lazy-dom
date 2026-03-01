import { HTMLElement } from "./HTMLElement"

export class HTMLModElement extends HTMLElement {
  get cite() {
    return this.getAttribute('cite') ?? ''
  }
  set cite(value: string) {
    this.setAttribute('cite', value)
  }

  get dateTime() {
    return this.getAttribute('datetime') ?? ''
  }
  set dateTime(value: string) {
    this.setAttribute('datetime', value)
  }
}
