import { Event } from './Event'
import { EventType } from '../types/EventType'

export class UIEvent extends Event {
  detail = 0
  view: unknown = null

  initUIEvent(type: EventType, bubbles = false, cancelable = false, view: unknown = null, detail = 0) {
    this.initEvent(type, bubbles, cancelable)
    this.view = view
    this.detail = detail
  }
}
