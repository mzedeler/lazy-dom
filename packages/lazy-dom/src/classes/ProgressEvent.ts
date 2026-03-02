import { Event } from './Event'
import { EventType } from '../types/EventType'

interface ProgressEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  lengthComputable?: boolean
  loaded?: number
  total?: number
}

export class ProgressEvent extends Event {
  lengthComputable: boolean
  loaded: number
  total: number

  constructor(type?: EventType, eventInitDict?: ProgressEventInit) {
    super(type, eventInitDict)
    this.lengthComputable = eventInitDict?.lengthComputable ?? false
    this.loaded = eventInitDict?.loaded ?? 0
    this.total = eventInitDict?.total ?? 0
  }
}
