import type { Listener } from "./Listener"
import type { AddEventListenerOptions } from "./Listeners"
import type { Event } from "../classes/Event"

export interface EventTarget {
  addEventListener: (type: string, listener: Listener, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: (type: string, listener: Listener, options?: boolean | AddEventListenerOptions) => void
  dispatchEvent: (event: Event) => boolean
}
