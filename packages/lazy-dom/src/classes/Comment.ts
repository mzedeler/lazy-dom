import { NodeTypes } from "../types/NodeTypes"
import { CharacterData } from "./CharacterData"

export class Comment extends CharacterData {
  readonly nodeName = '#comment'
  private _data: string

  constructor(data: string = '') {
    super(NodeTypes.COMMENT_NODE)
    this._data = data
  }

  get data(): string {
    return this._data
  }

  set data(data: string) {
    this._data = data
  }

  get nodeValue(): string {
    return this._data
  }

  set nodeValue(value: string) {
    this._data = value
  }

  protected _cloneNodeShallow(): Comment {
    return this.ownerDocument.createComment(this._data)
  }
}
