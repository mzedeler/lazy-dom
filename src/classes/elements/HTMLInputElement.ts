import { Element } from "../Element"

export class HTMLInputElement extends Element {
  get type() {
    return this.getAttribute('type') ?? 'text'
  }

  select() {}
}
