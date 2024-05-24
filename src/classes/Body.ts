import { Element } from "./Element"

export class Body extends Element {
  constructor() {
    super()
    this.elementStore.tagName = () => 'body'
  }
}
