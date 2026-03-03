import { Future } from "../types/Future"
import valueNotSetError from "../utils/valueNotSetError"

import { Node } from './Node/Node'
import { EventType } from '../types/EventType'

interface EventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
}

class EventStore {
  type: Future<EventType> = () => {
    throw valueNotSetError('type')
  }
  target: Future<Node> = () => {
    throw valueNotSetError('target')
  }
}

export class Event {
  eventStore = new EventStore()
  defaultPrevented = false
  cancelBubble = false
  bubbles = false
  cancelable = false
  composed = false
  currentTarget: Node | null = null
  eventPhase = 0
  isTrusted = false
  timeStamp = Date.now()
  _stopImmediatePropagation = false

  constructor(type?: EventType, eventInitDict?: EventInit) {
    if (type !== undefined) {
      this.eventStore.type = () => type
    }
    if (eventInitDict) {
      if (eventInitDict.bubbles !== undefined) this.bubbles = eventInitDict.bubbles
      if (eventInitDict.cancelable !== undefined) this.cancelable = eventInitDict.cancelable
      if (eventInitDict.composed !== undefined) this.composed = eventInitDict.composed
    }
  }

  get target(): Node {
    return this.eventStore.target()
  }

  get type(): EventType {
    return this.eventStore.type()
  }

  preventDefault() {
    if (this.cancelable) {
      this.defaultPrevented = true
    }
  }

  stopPropagation() {
    this.cancelBubble = true
  }

  stopImmediatePropagation() {
    this.cancelBubble = true
    this._stopImmediatePropagation = true
  }

  composedPath(): Node[] {
    const path: Node[] = []
    try {
      const target = this.eventStore.target()
      let current: Node | null = target
      while (current) {
        path.push(current)
        current = current.parentNode instanceof Node ? current.parentNode : null
      }
    } catch {
      // target not set
    }
    return path
  }

  initEvent(type: EventType, bubbles = false, cancelable = false) {
    this.eventStore.type = () => type
    this.bubbles = bubbles
    this.cancelable = cancelable
  }
}
