import type { Listener } from "../types/Listener"
import type { AddEventListenerOptions } from "../types/Listeners"
import type { Event } from "./Event"
import {
  EventTargetStore,
  addEventListenerImpl,
  removeEventListenerImpl,
  fireListenersAtTarget,
  fireOnHandler,
} from "./EventTargetImpl"

export class EventTarget {
  private _eventTargetStore = new EventTargetStore()

  addEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    addEventListenerImpl(this._eventTargetStore, type, listener, options)
  }

  removeEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    removeEventListenerImpl(this._eventTargetStore, type, listener, options)
  }

  dispatchEvent(event: Event): boolean {
    const type = event.eventStore ? event.eventStore.type() : event.type
    event.eventPhase = 2 // AT_TARGET
    event.currentTarget = null
    fireListenersAtTarget(this._eventTargetStore, type, event)
    fireOnHandler(this as unknown as Record<string, unknown>, type, event)
    event.eventPhase = 0
    return !event.defaultPrevented
  }
}
