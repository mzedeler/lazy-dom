import { Event } from './Event'
import { EventType } from '../types/EventType'

interface CustomEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  detail?: unknown
}

export class CustomEvent extends Event {
  detail: unknown

  constructor(type?: EventType, eventInitDict?: CustomEventInit) {
    super(type, eventInitDict)
    this.detail = eventInitDict?.detail ?? null
  }

  initCustomEvent(type: EventType, bubbles = false, cancelable = false, detail: unknown = null) {
    this.initEvent(type, bubbles, cancelable)
    this.detail = detail
  }
}
