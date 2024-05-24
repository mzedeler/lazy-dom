import { Element } from './Element'

class BodyStore  {}

export class Body extends Element {
  bodyStore = new BodyStore()

  constructor() {
    super()
    this.elementStore.tagName = () => 'body'
  }
}
