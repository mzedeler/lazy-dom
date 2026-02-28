import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"

export class ProcessingInstruction extends Node<string> {
  readonly target: string

  constructor(target: string, data: string) {
    super(NodeTypes.PROCESSING_INSTRUCTION_NODE)
    this.target = target
    this.nodeStore.nodeValue = () => data
  }

  get nodeName(): string {
    return this.target
  }

  get data(): string {
    return this.nodeStore.nodeValue()
  }

  set data(data: string) {
    this.nodeStore.nodeValue = () => data
  }

  get nodeValue(): string {
    return this.data
  }

  set nodeValue(value: string) {
    this.data = value
  }

  readonly attributes = null

  protected _cloneNodeShallow(): ProcessingInstruction {
    return this.ownerDocument.createProcessingInstruction(this.target, this.data)
  }
}
