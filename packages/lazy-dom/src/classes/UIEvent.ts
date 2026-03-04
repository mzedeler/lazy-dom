import { Event } from './Event'
import { EventType } from '../types/EventType'

interface UIEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  detail?: number
  view?: unknown
}

export class UIEvent extends Event {
  detail: number
  view: unknown

  constructor(type?: EventType, eventInitDict?: UIEventInit) {
    super(type, eventInitDict)
    this.detail = eventInitDict?.detail ?? 0
    this.view = eventInitDict?.view ?? null
  }

  initUIEvent(type: EventType, bubbles = false, cancelable = false, view: unknown = null, detail = 0) {
    this.initEvent(type, bubbles, cancelable)
    this.view = view
    this.detail = detail
  }
}
