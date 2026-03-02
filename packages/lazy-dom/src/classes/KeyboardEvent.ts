import { UIEvent } from './UIEvent'
import { EventType } from '../types/EventType'

interface KeyboardEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  key?: string
  code?: string
  location?: number
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  repeat?: boolean
  isComposing?: boolean
  charCode?: number
  keyCode?: number
  which?: number
}

export class KeyboardEvent extends UIEvent {
  // These are kept as regular instance properties
  key: string
  location: number
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  repeat: boolean
  isComposing: boolean

  // Backing fields for properties that must be prototype getters
  // so Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, ...) works
  private _code: string
  private _charCode: number
  private _keyCode: number
  private _which: number

  constructor(type?: EventType, eventInitDict?: KeyboardEventInit) {
    super(type, eventInitDict)
    this.key = eventInitDict?.key ?? ''
    this._code = eventInitDict?.code ?? ''
    this.location = eventInitDict?.location ?? 0
    this.ctrlKey = eventInitDict?.ctrlKey ?? false
    this.shiftKey = eventInitDict?.shiftKey ?? false
    this.altKey = eventInitDict?.altKey ?? false
    this.metaKey = eventInitDict?.metaKey ?? false
    this.repeat = eventInitDict?.repeat ?? false
    this.isComposing = eventInitDict?.isComposing ?? false
    this._charCode = eventInitDict?.charCode ?? 0
    this._keyCode = eventInitDict?.keyCode ?? 0
    this._which = eventInitDict?.which ?? 0
  }

  get code(): string { return this._code }
  set code(v: string) { this._code = v }

  get charCode(): number { return this._charCode }
  set charCode(v: number) { this._charCode = v }

  get keyCode(): number { return this._keyCode }
  set keyCode(v: number) { this._keyCode = v }

  get which(): number { return this._which }
  set which(v: number) { this._which = v }
}
