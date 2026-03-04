import { UIEvent } from './UIEvent'
import { EventType } from '../types/EventType'

interface InputEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  detail?: number
  view?: unknown
  data?: string | null
  inputType?: string
  isComposing?: boolean
  dataTransfer?: unknown
  targetRanges?: unknown[]
}

export class InputEvent extends UIEvent {
  readonly data: string | null
  readonly inputType: string
  readonly isComposing: boolean
  readonly dataTransfer: unknown
  private readonly _targetRanges: unknown[]

  constructor(type?: EventType, eventInitDict?: InputEventInit) {
    super(type, eventInitDict)
    this.data = eventInitDict?.data ?? null
    this.inputType = eventInitDict?.inputType ?? ''
    this.isComposing = eventInitDict?.isComposing ?? false
    this.dataTransfer = eventInitDict?.dataTransfer ?? null
    this._targetRanges = eventInitDict?.targetRanges ?? []
  }

  getTargetRanges(): unknown[] {
    return this._targetRanges
  }
}
