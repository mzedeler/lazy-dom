import { Element } from "../Element"

export class HTMLBodyElement extends Element {
  constructor() {
    super()
    this.elementStore.tagName.set(() => 'BODY')
  }
}
