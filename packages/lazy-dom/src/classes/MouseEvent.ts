import { UIEvent } from './UIEvent'
import { EventType } from '../types/EventType'

interface MouseEventInit {
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
  screenX?: number
  screenY?: number
  clientX?: number
  clientY?: number
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  button?: number
  buttons?: number
  relatedTarget?: unknown
  movementX?: number
  movementY?: number
  pageX?: number
  pageY?: number
  offsetX?: number
  offsetY?: number
}

export class MouseEvent extends UIEvent {
  screenX: number
  screenY: number
  clientX: number
  clientY: number
  ctrlKey: boolean
  altKey: boolean
  shiftKey: boolean
  metaKey: boolean
  button: number
  buttons: number
  relatedTarget: unknown
  declare movementX: number | undefined
  declare movementY: number | undefined
  pageX: number
  pageY: number
  offsetX: number
  offsetY: number

  constructor(type?: EventType, eventInitDict?: MouseEventInit) {
    super(type, eventInitDict)
    this.screenX = eventInitDict?.screenX ?? 0
    this.screenY = eventInitDict?.screenY ?? 0
    this.clientX = eventInitDict?.clientX ?? 0
    this.clientY = eventInitDict?.clientY ?? 0
    this.ctrlKey = eventInitDict?.ctrlKey ?? false
    this.altKey = eventInitDict?.altKey ?? false
    this.shiftKey = eventInitDict?.shiftKey ?? false
    this.metaKey = eventInitDict?.metaKey ?? false
    this.button = eventInitDict?.button ?? 0
    this.buttons = eventInitDict?.buttons ?? 0
    this.relatedTarget = eventInitDict?.relatedTarget ?? null
    // Only set movementX/Y if explicitly provided, so 'movementX' in event
    // returns false when not provided (matching JSDOM behavior for polyfill compat)
    if (eventInitDict?.movementX !== undefined) this.movementX = eventInitDict.movementX
    if (eventInitDict?.movementY !== undefined) this.movementY = eventInitDict.movementY
    this.pageX = eventInitDict?.pageX ?? 0
    this.pageY = eventInitDict?.pageY ?? 0
    this.offsetX = eventInitDict?.offsetX ?? 0
    this.offsetY = eventInitDict?.offsetY ?? 0
  }

  initMouseEvent(
    type: EventType,
    bubbles = false,
    cancelable = false,
    view: unknown = null,
    detail = 0,
    screenX = 0,
    screenY = 0,
    clientX = 0,
    clientY = 0,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    metaKey = false,
    button = 0,
    relatedTarget: unknown = null
  ) {
    this.initUIEvent(type, bubbles, cancelable, view, detail)
    this.screenX = screenX
    this.screenY = screenY
    this.clientX = clientX
    this.clientY = clientY
    this.ctrlKey = ctrlKey
    this.altKey = altKey
    this.shiftKey = shiftKey
    this.metaKey = metaKey
    this.button = button
    this.relatedTarget = relatedTarget
  }
}
