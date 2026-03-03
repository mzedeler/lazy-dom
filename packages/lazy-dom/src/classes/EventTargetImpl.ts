import type { Future } from "../types/Future"
import type { Listener } from "../types/Listener"
import type { Listeners, ListenerEntry, AddEventListenerOptions } from "../types/Listeners"
import type { Event } from "./Event"

export class EventTargetStore {
  eventListeners: Future<Listeners> = () => ({})
}

export function parseListenerOptions(options?: boolean | AddEventListenerOptions): { capture: boolean; passive: boolean; once: boolean } {
  if (typeof options === 'boolean') return { capture: options, passive: false, once: false }
  // Reading passive/once from the options object triggers getter-based feature detection
  // (e.g. React checks if the browser supports passive events this way)
  return {
    capture: options?.capture ?? false,
    passive: options?.passive ?? false,
    once: options?.once ?? false,
  }
}

export function memoizeListeners(store: EventTargetStore): Listeners {
  const listeners = store.eventListeners()
  store.eventListeners = () => listeners
  return listeners
}

export function addEventListenerImpl(store: EventTargetStore, type: string, listener: Listener, options?: boolean | AddEventListenerOptions): void {
  if (!listener) return
  const { capture, passive, once } = parseListenerOptions(options)
  const listeners = memoizeListeners(store)
  let queue = listeners[type]
  if (!queue) {
    queue = []
    listeners[type] = queue
  }
  // DOM spec: do not add if already contains listener with same type, callback, and capture
  const duplicate = queue.some(
    entry => entry.listener === listener && entry.capture === capture
  )
  if (duplicate) return
  queue.push({ listener, capture, passive, once })
}

export function removeEventListenerImpl(store: EventTargetStore, type: string, listener: unknown, options?: boolean | AddEventListenerOptions): void {
  if (!listener) return
  const { capture } = parseListenerOptions(options)
  const listeners = memoizeListeners(store)
  const queue = listeners[type]
  if (queue) {
    const idx = queue.findIndex(
      entry => entry.listener === listener && entry.capture === capture
    )
    if (idx !== -1) {
      queue.splice(idx, 1)
    }
  }
}

/**
 * Fire listeners matching the given capture flag.
 * Handles once removal, stopImmediatePropagation, and error handling.
 */
export function fireListenersImpl(
  store: EventTargetStore,
  type: string,
  event: Event,
  capture: boolean,
  errorHandler?: (err: unknown) => void,
): void {
  const listeners = store.eventListeners()
  const queue = listeners[type]
  if (!queue || queue.length === 0) return
  const snapshot = queue.slice()
  for (const entry of snapshot) {
    if (event._stopImmediatePropagation) break
    if (entry.capture === capture) {
      callListener(entry, queue, event, errorHandler)
    }
  }
}

/**
 * Fire ALL listeners in registration order regardless of capture flag.
 * Used for AT_TARGET phase and direct dispatchEvent calls.
 */
export function fireListenersAtTarget(
  store: EventTargetStore,
  type: string,
  event: Event,
  errorHandler?: (err: unknown) => void,
): void {
  const listeners = store.eventListeners()
  const queue = listeners[type]
  if (!queue || queue.length === 0) return
  const snapshot = queue.slice()
  for (const entry of snapshot) {
    if (event._stopImmediatePropagation) break
    callListener(entry, queue, event, errorHandler)
  }
}

function callListener(
  entry: ListenerEntry,
  queue: ListenerEntry[],
  event: Event,
  errorHandler?: (err: unknown) => void,
): void {
  // Remove before calling if once is set, so re-entrant dispatches don't fire it again
  if (entry.once) {
    const idx = queue.indexOf(entry)
    if (idx !== -1) {
      queue.splice(idx, 1)
    }
  }
  if (errorHandler) {
    try {
      entry.listener(event)
    } catch (err) {
      errorHandler(err)
    }
  } else {
    entry.listener(event)
  }
}

/**
 * Fire the on* property handler (e.g. onclick) during non-capture phase.
 */
export function fireOnHandler(
  target: Record<string, unknown>,
  type: string,
  event: Event,
  errorHandler?: (err: unknown) => void,
): void {
  if (event._stopImmediatePropagation) return
  const handler = target[`on${type}`]
  if (typeof handler === 'function') {
    if (errorHandler) {
      try {
        handler.call(target, event)
      } catch (err) {
        errorHandler(err)
      }
    } else {
      handler.call(target, event)
    }
  }
}
