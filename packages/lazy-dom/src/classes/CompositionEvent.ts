import { UIEvent } from './UIEvent'
import { EventType } from '../types/EventType'

interface CompositionEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  data?: string
  view?: unknown
  detail?: number
}

export class CompositionEvent extends UIEvent {
  data: string

  constructor(type?: EventType, eventInitDict?: CompositionEventInit) {
    super(type, eventInitDict)
    this.data = eventInitDict?.data ?? ''
  }
}
