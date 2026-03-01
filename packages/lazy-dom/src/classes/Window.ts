import type { Future } from "../types/Future"
import type { Listeners } from "../types/Listeners"
import type { Listener } from "../types/Listener"
import type { Event } from "./Event"

class WindowStore {
  eventListeners: Future<Listeners> = () => ({})
}

export class Window {
  private windowStore = new WindowStore()

  innerWidth = 1024
  innerHeight = 768

  private _location: Record<string, string> = {
    href: 'http://localhost:9009/b',
    protocol: 'http:',
    hostname: 'localhost',
    pathname: '/b',
    origin: 'http://localhost:9009',
    search: '',
    hash: '',
  }

  get location() {
    return this._location
  }

  set location(value: string | Record<string, string>) {
    if (typeof value === 'string') {
      this._location.href = value
    } else {
      Object.assign(this._location, value)
    }
  }

  getComputedStyle() {
    return {
      getPropertyValue() {
        return ''
      }
    }
  }

  matchMedia(mediaQueryString: string) {
    return {
      matches: false,
      media: mediaQueryString,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() { return true },
    }
  }

  private _history = {
    state: null as unknown,
    length: 1,
    scrollRestoration: 'auto' as ScrollRestoration,
    back() {},
    forward() {},
    go(_delta?: number) {},
    pushState(state: unknown, _unused: string, _url?: string | URL | null) {
      this.state = state
      this.length++
    },
    replaceState(state: unknown, _unused: string, _url?: string | URL | null) {
      this.state = state
    },
  }

  get history() {
    return this._history
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.windowStore.eventListeners()
    const queue = listeners[event.type]
    if (queue && queue.length) {
      queue.forEach((listener: Listener) => listener(event))
    }
    return !event.defaultPrevented
  }

  addEventListener(type: string, listener: Listener) {
    if (!listener) return
    const previousEventListenersFuture = this.windowStore.eventListeners
    this.windowStore.eventListeners = () => {
      const previousEventListeners = previousEventListenersFuture()
      let queue = previousEventListeners[type]
      if (!queue) {
        queue = []
      }
      queue.push(listener)
      previousEventListeners[type] = queue
      return previousEventListeners
    }
  }

  removeEventListener(type: string, listener: Listener) {
    if (!listener) return
    const previousEventListenersFuture = this.windowStore.eventListeners
    this.windowStore.eventListeners = () => {
      const previousEventListeners = previousEventListenersFuture()
      const queue = previousEventListeners[type]
      if (queue) {
        const idx = queue.indexOf(listener)
        if (idx !== -1) {
          queue.splice(idx, 1)
        }
      }
      return previousEventListeners
    }
  }

  open(): null { return null }

  get localStorage() {
    return {
      getItem() {
        return null
      },
      setItem() {
        return
      }
    }
  }
}
