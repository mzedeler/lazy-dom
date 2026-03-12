import type { AddEventListenerOptions } from "../types/Listeners"
import type { Listener } from "../types/Listener"
import type { Event } from "./Event"
import {
  EventTargetStore,
  disposedEventTargetStore,
  addEventListenerImpl,
  removeEventListenerImpl,
  fireListenersImpl,
  fireListenersAtTarget,
  fireOnHandler,
} from "./EventTargetImpl"
import { Selection } from "./Selection"

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

export class Window {
  private _eventTargetStore = new EventTargetStore()
  private _selection = new Selection()

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

  private _locationData = {
    href: 'http://localhost/',
    protocol: 'http:',
    hostname: 'localhost',
    pathname: '/',
    origin: 'http://localhost',
    search: '',
    hash: '',
    host: 'localhost',
    port: '',
  }

  private _location: Location | undefined

  private _getLocation(): Location {
    if (this._location) return this._location
    const data = this._locationData
    this._location = {
      get href() { return data.href },
      set href(_value: string) { /* no-op: navigation not implemented */ },
      get protocol() { return data.protocol },
      set protocol(_value: string) { /* no-op */ },
      get host() { return data.host },
      set host(_value: string) { /* no-op */ },
      get hostname() { return data.hostname },
      set hostname(_value: string) { /* no-op */ },
      get port() { return data.port },
      set port(_value: string) { /* no-op */ },
      get pathname() { return data.pathname },
      set pathname(_value: string) { /* no-op */ },
      get search() { return data.search },
      set search(_value: string) { /* no-op */ },
      get hash() { return data.hash },
      set hash(value: string) {
        const normalized = value.startsWith('#') ? value : `#${value}`
        data.hash = normalized
        const url = new URL(data.href)
        url.hash = normalized
        data.href = url.href
      },
      get origin() { return data.origin },
      assign(_url: string) { /* no-op: navigation not implemented */ },
      replace(_url: string) { /* no-op: navigation not implemented */ },
      reload() { /* no-op: navigation not implemented */ },
      toString() { return data.href },
    } as unknown as Location
    return this._location
  }

  get location(): Location {
    return this._getLocation()
  }

  set location(_value: string | Location) {
    /* no-op: navigation not implemented */
  }

  /** @internal Set the base URL (used by JSDOM constructor). */
  _setLocationUrl(href: string) {
    try {
      const resolved = new URL(href, this._locationData.href)
      this._locationData.href = resolved.href
      this._locationData.protocol = resolved.protocol
      this._locationData.hostname = resolved.hostname
      this._locationData.pathname = resolved.pathname
      this._locationData.origin = resolved.origin
      this._locationData.search = resolved.search
      this._locationData.hash = resolved.hash
      this._locationData.host = resolved.host
      this._locationData.port = resolved.port
    } catch {
      this._locationData.href = href
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
    event.eventPhase = 2 // AT_TARGET
    event.currentTarget = this as unknown as import('./Node/Node').Node
    fireListenersAtTarget(this._eventTargetStore, type, event, (err) => this._handleListenerError(err))
    fireOnHandler(this as unknown as Record<string, unknown>, type, event, (err) => this._handleListenerError(err))
    event.eventPhase = 0
    event.currentTarget = null
    return !event.defaultPrevented
  }

  /** Fire listeners matching the given capture flag (called by Element.dispatchEvent during propagation). */
  _fireListeners(type: string, event: Event, capture: boolean) {
    fireListenersImpl(this._eventTargetStore, type, event, capture, (err) => this._handleListenerError(err))
    if (!capture) {
      fireOnHandler(this as unknown as Record<string, unknown>, type, event, (err) => this._handleListenerError(err))
    }
  }

  private _handleListenerError(err: unknown) {
    const errObj = err as { message?: string }
    const message = (typeof errObj?.message === 'string') ? errObj.message : String(err)
    // Lazy import to avoid circular dependency (Window -> ErrorEvent -> Event -> Node -> Document -> Window)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ErrorEvent: ErrorEventClass } = require('./ErrorEvent') as typeof import('./ErrorEvent')
    const errorEvent = new ErrorEventClass('error', {
      message,
      error: err,
      cancelable: true,
    })
    const handled = !this.dispatchEvent(errorEvent)
    if (!handled) {
      this.console.error(`Error: Uncaught [${err}]`, err)
    }
  }

  addEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    addEventListenerImpl(this._eventTargetStore, type, listener, options)
  }

  removeEventListener(type: string, listener: Listener, options?: boolean | AddEventListenerOptions) {
    removeEventListenerImpl(this._eventTargetStore, type, listener, options)
  }

  open(): null { return null }

  scrollTo() {}
  scrollBy() {}
  scroll() {}

  getSelection(): Selection {
    return this._selection
  }

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

  /** Break internal references so the Window can be GC'd.
   *  Called during reset() between test suites. Safe to call multiple times. */
  _dispose(): void {
    this._eventTargetStore = disposedEventTargetStore
    if (this._selection) {
      this._selection.removeAllRanges()
      this._selection = null as unknown as Selection
    }
    this._location = undefined
    this._locationData = null as unknown as typeof this._locationData
    this._history = null as unknown as typeof this._history
    // console may have been redefined with a getter by the jest environment,
    // so use defineProperty to safely override it
    try {
      Object.defineProperty(this, 'console', { value: null, configurable: true, writable: true })
    } catch {
      // ignore if not configurable
    }
    this.event = undefined
  }
}
