import { Future } from "../types/Future"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"
import { CharacterData } from "./CharacterData"
import { notifyMutation } from "./mutationNotify"

class TextStore  {
  data: Future<string> = () => {
    throw valueNotSetError('data')
  }
}

export class Text extends CharacterData {
  textStore = new TextStore()

  nodeName = '#text'

  constructor() {
    super(NodeTypes.TEXT_NODE)
  }

  get textContent() {
    return this.textStore.data()
  }

  set textContent(value: string) {
    const coerced = value === null ? '' : String(value)
    let oldValue: string | null = null
    try { oldValue = this.textStore.data() } catch { /* uninitialized */ }
    this.textStore.data = () => coerced
    if (oldValue !== null && oldValue !== coerced) {
      notifyMutation({ type: 'characterData', target: this, oldValue })
    }
  }

  get data() {
    return this.textStore.data()
  }

  set data(value: string) {
    const coerced = value === null ? '' : String(value)
    let oldValue: string | null = null
    try { oldValue = this.textStore.data() } catch { /* uninitialized */ }
    this.textStore.data = () => coerced
    if (oldValue !== null && oldValue !== coerced) {
      notifyMutation({ type: 'characterData', target: this, oldValue })
    }
  }

  get nodeValue() {
    return this.textStore.data()
  }

  set nodeValue(value: string) {
    const coerced = value === null ? '' : String(value)
    let oldValue: string | null = null
    try { oldValue = this.textStore.data() } catch { /* uninitialized */ }
    this.textStore.data = () => coerced
    if (oldValue !== null && oldValue !== coerced) {
      notifyMutation({ type: 'characterData', target: this, oldValue })
    }
  }

  protected _cloneNodeShallow(): Text {
    return this.ownerDocument.createTextNode(this.data)
  }

  splitText(offset: number): Text {
    if (offset < 0 || offset > this.data.length) {
      throw new Error('INDEX_SIZE_ERR')
    }
    const newData = this.data.substring(offset)
    this.data = this.data.substring(0, offset)

    const newText = this.ownerDocument.createTextNode(newData)

    // Insert after this node in the parent
    const parent = this.parentNode
    if (parent) {
      const nextSib = this.nextSibling
      if (nextSib) {
        parent.insertBefore(newText, nextSib)
      } else {
        parent.appendChild(newText)
      }
    }

    return newText
  }
}
