import { Listener } from "./Listener"

export type AddEventListenerOptions = { capture?: boolean; passive?: boolean; once?: boolean }

export interface ListenerEntry {
  listener: Listener
  capture: boolean
  passive: boolean
  once: boolean
}

export type Listeners = Record<string, ListenerEntry[]>
