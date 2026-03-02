import { Event } from './Event'
import { EventType } from '../types/EventType'

interface ErrorEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  message?: string
  filename?: string
  lineno?: number
  colno?: number
  error?: unknown
}

export class ErrorEvent extends Event {
  message: string
  filename: string
  lineno: number
  colno: number
  error: unknown

  constructor(type?: EventType, eventInitDict?: ErrorEventInit) {
    super(type, eventInitDict)
    this.message = eventInitDict?.message ?? ''
    this.filename = eventInitDict?.filename ?? ''
    this.lineno = eventInitDict?.lineno ?? 0
    this.colno = eventInitDict?.colno ?? 0
    this.error = eventInitDict?.error ?? null
  }
}
