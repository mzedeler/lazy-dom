import { Future } from "../types/Future"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"
import { Node } from "./Node/Node"

class TextStore  {
  data: Future<string> = () => {
    throw valueNotSetError('data')
  }
}

export class Text extends Node<string> {
  textStore = new TextStore()

  nodeName = '#text'

  constructor() {
    super(NodeTypes.TEXT_NODE)
  }

  get textContent() {
    return this.textStore.data()
  }

  get data() {
    return this.textStore.data()
  }

  set data(data: string) {
    this.textStore.data = () => data
  }

  get nodeValue() {
    return this.textStore.data()
  }

  set nodeValue(value: string) {
    this.textStore.data = () => value
  }
}
