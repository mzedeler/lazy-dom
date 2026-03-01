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

  get length(): number {
    return this.data.length
  }

  appendData(data: string): void {
    this.data = this.data + data
  }

  deleteData(offset: number, count: number): void {
    if (offset < 0 || offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    const current = this.data
    this.data = current.substring(0, offset) + current.substring(offset + count)
  }

  insertData(offset: number, arg: string): void {
    if (offset < 0 || offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    const current = this.data
    this.data = current.substring(0, offset) + arg + current.substring(offset)
  }

  replaceData(offset: number, count: number, arg: string): void {
    if (offset < 0 || offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    const current = this.data
    this.data = current.substring(0, offset) + arg + current.substring(offset + count)
  }

  substringData(offset: number, count: number): string {
    if (offset < 0 || offset > this.data.length) {
      throw new DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException.INDEX_SIZE_ERR)
    }
    return this.data.substring(offset, offset + count)
  }
}
