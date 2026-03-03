import type { Future } from "../types/Future"
import type { Listeners, AddEventListenerOptions } from "../types/Listeners"
import type { Listener } from "../types/Listener"
import type { Event } from "./Event"

// Default CSS display values for common HTML elements
const inlineElements = new Set([
  'A', 'ABBR', 'B', 'BDO', 'BR', 'CITE', 'CODE', 'DFN', 'EM', 'I',
  'IMG', 'INPUT', 'KBD', 'LABEL', 'MAP', 'OBJECT', 'Q', 'SAMP',
  'SCRIPT', 'SELECT', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP',
  'TEXTAREA', 'TIME', 'VAR', 'BUTTON',
])
const tableDisplayElements: Record<string, string> = {
  TABLE: 'table', CAPTION: 'table-caption',
  THEAD: 'table-header-group', TBODY: 'table-row-group', TFOOT: 'table-footer-group',
  TR: 'table-row', TD: 'table-cell', TH: 'table-cell',
  COL: 'table-column', COLGROUP: 'table-column-group',
}

function getDefaultDisplay(tagName?: string): string {
  if (!tagName) return 'block'
  const upper = tagName.toUpperCase()
  if (upper === 'NONE') return 'none'
  if (inlineElements.has(upper)) return 'inline'
  if (upper === 'LI') return 'list-item'
  const tableDisplay = tableDisplayElements[upper]
  if (tableDisplay) return tableDisplay
  return 'block'
}

// CSS computed value defaults for properties that should not return empty string.
// HeadlessUI and other libraries parse these for transition/animation handling.
const cssDefaults: Record<string, string> = {
  display: '',  // handled separately via getDefaultDisplay
  'transition-duration': '0s',
  'transition-delay': '0s',
  'transition-property': 'all',
  'animation-duration': '0s',
  'animation-delay': '0s',
  transitionDuration: '0s',
  transitionDelay: '0s',
  transitionProperty: 'all',
  animationDuration: '0s',
  animationDelay: '0s',
}

function getComputedDefault(prop: string, tagName?: string): string {
  if (prop === 'display') return getDefaultDisplay(tagName)
  return cssDefaults[prop] ?? ''
}

class WindowStore {
  eventListeners: Future<Listeners> = () => ({})
}

export class Window {
  private windowStore = new WindowStore()

  innerWidth = 1024
  innerHeight = 768
  scrollX = 0
  scrollY = 0
  pageXOffset = 0
  pageYOffset = 0

  // Expose console so that error-reporting code can use win.console.error(...)
  // instead of the module-level console. This is necessary because Jest's VM
  // sandbox provides its own console that tests spy on, which differs from
  // the Node.js module-level console that lazy-dom code sees.
  console: Console = globalThis.console

  // React's invokeGuardedCallback checks window.event and window.hasOwnProperty('event')
  event: Event | undefined = undefined

  private _location: Record<string, string> = {
    href: 'http://localhost/',
    protocol: 'http:',
    hostname: 'localhost',
    pathname: '/',
    origin: 'http://localhost',
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

  getComputedStyle(element?: { style?: Record<string, unknown> & { getPropertyValue?: (p: string) => string }; tagName?: string }) {
    const target = {
      getPropertyValue(property: string): string {
        if (element?.style?.getPropertyValue) {
          const val = element.style.getPropertyValue(property)
          if (val) return val
        }
        return getComputedDefault(property, element?.tagName)
      },
    }
    return new Proxy(target, {
      get(t, prop, receiver) {
        if (prop === 'getPropertyValue') {
          return Reflect.get(t, prop, receiver)
        }
        if (typeof prop === 'string' && element?.style) {
          const val = element.style[prop]
          if (typeof val === 'string' && val !== '') return val
        }
        if (typeof prop === 'string') {
          return getComputedDefault(prop, element?.tagName)
        }
        return ''
      },
    })
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
    const type = event.type
    this._fireListeners(type, event, false)
    return !event.defaultPrevented
  }

  /** Fire listeners matching the given capture flag. */
  _fireListeners(type: string, event: Event, capture: boolean) {
    const listeners = this.windowStore.eventListeners()
    const queue = listeners[type]
    if (!queue || queue.length === 0) return
    const snapshot = queue.slice()
    for (const entry of snapshot) {
      if (event.cancelBubble) break
      if (entry.capture === capture) {
        entry.listener(event)
      }
    }
  }

  private _memoizeListeners(): Listeners {
    const listeners = this.windowStore.eventListeners()
    this.windowStore.eventListeners = () => listeners
    return listeners
  }

  addEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    if (!listener) return
    const capture = typeof options === 'boolean' ? options : (options?.capture ?? false)
    const passive = typeof options === 'boolean' ? false : (options?.passive ?? false)
    const once = typeof options === 'boolean' ? false : (options?.once ?? false)
    const listeners = this._memoizeListeners()
    let queue = listeners[type]
    if (!queue) {
      queue = []
      listeners[type] = queue
    }
    queue.push({ listener, capture, passive, once })
  }

  removeEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    if (!listener) return
    const capture = typeof options === 'boolean' ? options : (options?.capture ?? false)
    const listeners = this._memoizeListeners()
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

  open(): null { return null }

  scrollTo() {}
  scrollBy() {}
  scroll() {}

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
