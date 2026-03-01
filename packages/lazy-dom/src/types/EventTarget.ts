import type { Listener } from "./Listener"
import type { Event } from "../classes/Event"

export interface EventTarget {
  addEventListener: (type: string, listener: Listener) => void
  dispatchEvent: (event: Event) => void
}
