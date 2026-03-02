import { UIEvent } from './UIEvent'
import { EventType } from '../types/EventType'

interface FocusEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  relatedTarget?: unknown
  view?: unknown
  detail?: number
}

export class FocusEvent extends UIEvent {
  relatedTarget: unknown

  constructor(type?: EventType, eventInitDict?: FocusEventInit) {
    super(type, eventInitDict)
    this.relatedTarget = eventInitDict?.relatedTarget ?? null
  }
}
