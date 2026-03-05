import { NodeTypes } from "../types/NodeTypes"
import { Node } from "./Node/Node"
import { DOMException } from "./DOMException"

export abstract class CharacterData extends Node {
  constructor(nodeType: NodeTypes) {
    super(nodeType)
  }

  abstract get data(): string
  abstract set data(data: string)

  get nodeValue(): string {
    return this.data
  }

  set nodeValue(value: string) {
    this.data = value
  }

  get textContent(): string {
    return this.data
  }

  set textContent(value: string) {
    this.data = value
  }

  get length(): number {
    return this.data.length
  }

  appendData(...args: unknown[]): void {
    if (args.length === 0) {
      throw new TypeError("Failed to execute 'appendData' on 'CharacterData': 1 argument required, but only 0 present.")
    }
    const data = args[0] === undefined ? 'undefined' : args[0] === null ? 'null' : String(args[0])
    this.data = this.data + data
  }

  deleteData(offset: number, count: number): void {
    offset = offset >>> 0
    count = count >>> 0
    if (offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    const current = this.data
    this.data = current.substring(0, offset) + current.substring(offset + count)
  }

  insertData(offset: number, arg: string): void {
    offset = offset >>> 0
    if (offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    const current = this.data
    this.data = current.substring(0, offset) + arg + current.substring(offset)
  }

  replaceData(offset: number, count: number, arg: string): void {
    offset = offset >>> 0
    count = count >>> 0
    if (offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    const current = this.data
    this.data = current.substring(0, offset) + arg + current.substring(offset + count)
  }

  substringData(...args: unknown[]): string {
    if (args.length < 2) {
      throw new TypeError("Failed to execute 'substringData' on 'CharacterData': 2 arguments required, but only " + args.length + " present.")
    }
    const offset = (args[0] as number) >>> 0
    const count = (args[1] as number) >>> 0
    if (offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    return this.data.substring(offset, offset + count)
  }
}
