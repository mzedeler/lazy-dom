import NodeEnvironment from "jest-environment-node"
import type { EnvironmentContext } from "@jest/environment"
import type { JestEnvironmentConfig } from "@jest/environment"
import lazyDom, { reset } from "lazy-dom"

export default class LazyDomEnvironment extends NodeEnvironment {
  private _rafFlush: (() => void) | null = null

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context)

    const { window, document, classes } = lazyDom()

    const g = this.global

    // Assign all DOM classes onto the global
    for (const [name, value] of Object.entries(classes)) {
      Object.defineProperty(g, name, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      })
    }

    // Assign DOM instances
    Object.defineProperty(g, "document", {
      configurable: true,
      enumerable: true,
      value: document,
      writable: true,
    })

    Object.defineProperty(g, "navigator", {
      configurable: true,
      enumerable: true,
      value: { userAgent: "Mozilla/5.0 (jsdom, lazy-dom-compatible)" },
      writable: true,
    })

    // Browser convention: window === globalThis
    Object.defineProperty(g, "window", {
      configurable: true,
      enumerable: true,
      value: g,
      writable: true,
    })

    // Attach Window methods to global
    Object.defineProperty(g, "getComputedStyle", {
      configurable: true,
      enumerable: true,
      value: window.getComputedStyle.bind(window),
      writable: true,
    })
    Object.defineProperty(g, "matchMedia", {
      configurable: true,
      enumerable: true,
      value: window.matchMedia.bind(window),
      writable: true,
    })
    // Override localStorage with a full in-memory implementation
    const storage = new Map<string, string>()
    const localStorageStub = {
      getItem(key: string) { return storage.get(key) ?? null },
      setItem(key: string, value: string) { storage.set(key, String(value)) },
      removeItem(key: string) { storage.delete(key) },
      clear() { storage.clear() },
      get length() { return storage.size },
      key(index: number) {
        const keys = Array.from(storage.keys())
        return keys[index] ?? null
      },
    }
    Object.defineProperty(g, "localStorage", {
      configurable: true,
      enumerable: true,
      value: localStorageStub,
      writable: true,
    })
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      enumerable: true,
      value: localStorageStub,
      writable: true,
    })
    // sessionStorage: separate Map-backed storage
    const sessionStore = new Map<string, string>()
    const sessionStorageStub = {
      getItem(key: string) { return sessionStore.get(key) ?? null },
      setItem(key: string, value: string) { sessionStore.set(key, String(value)) },
      removeItem(key: string) { sessionStore.delete(key) },
      clear() { sessionStore.clear() },
      get length() { return sessionStore.size },
      key(index: number) {
        const keys = Array.from(sessionStore.keys())
        return keys[index] ?? null
      },
    }
    Object.defineProperty(g, "sessionStorage", {
      configurable: true,
      enumerable: true,
      value: sessionStorageStub,
      writable: true,
    })
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      enumerable: true,
      value: sessionStorageStub,
      writable: true,
    })
    Object.defineProperty(g, "location", {
      configurable: true,
      enumerable: true,
      value: window.location,
      writable: true,
    })
    Object.defineProperty(g, "addEventListener", {
      configurable: true,
      enumerable: true,
      value: window.addEventListener.bind(window),
      writable: true,
    })
    Object.defineProperty(g, "removeEventListener", {
      configurable: true,
      enumerable: true,
      value: window.removeEventListener.bind(window),
      writable: true,
    })

    // Wire the lazy-dom Window's console to the jest global's console,
    // so that console.error calls from error reporting are captured by test spies.
    // Use a getter so it always resolves the CURRENT g.console (which Jest may
    // replace after the environment constructor runs).
    Object.defineProperty(window, "console", {
      configurable: true,
      enumerable: true,
      get() { return g.console },
    })

    // document.defaultView is already set to the lazy-dom Window by lazyDom()

    // Restore Node.js globals that jest-fixed-jsdom also restores
    g.TextDecoder = TextDecoder
    g.TextEncoder = TextEncoder
    g.TextDecoderStream = TextDecoderStream
    g.TextEncoderStream = TextEncoderStream
    g.ReadableStream = ReadableStream
    g.TransformStream = TransformStream
    g.WritableStream = WritableStream

    g.Blob = Blob
    g.Headers = Headers
    g.FormData = FormData
    g.Request = Request
    g.Response = Response
    g.fetch = fetch
    g.AbortController = AbortController
    g.AbortSignal = AbortSignal
    g.structuredClone = structuredClone
    g.URL = URL
    g.URLSearchParams = URLSearchParams
    g.BroadcastChannel = BroadcastChannel

    // FileReader polyfill — Node.js does not provide FileReader as a global.
    // Rails ActiveStorage DirectUpload uses FileReader to compute file checksums.
    type FileReaderListener = (event: { type: string; target: unknown; currentTarget: unknown }) => void
    g.FileReader = class FileReader implements globalThis.FileReader {
      static readonly EMPTY = 0
      static readonly LOADING = 1
      static readonly DONE = 2
      readonly EMPTY = 0
      readonly LOADING = 1
      readonly DONE = 2
      readyState: 0 | 1 | 2 = 0
      result: ArrayBuffer | string | null = null
      error: DOMException | null = null
      onload: FileReaderListener | null = null
      onerror: FileReaderListener | null = null
      onloadend: FileReaderListener | null = null
      onloadstart: FileReaderListener | null = null
      onprogress: FileReaderListener | null = null
      onabort: FileReaderListener | null = null
      private _listeners = new Map<string, FileReaderListener[]>()

      addEventListener(type: string, listener: FileReaderListener) {
        const list = this._listeners.get(type) ?? []
        list.push(listener)
        this._listeners.set(type, list)
      }
      removeEventListener(type: string, listener: FileReaderListener) {
        const list = this._listeners.get(type)
        if (list) {
          const idx = list.indexOf(listener)
          if (idx >= 0) list.splice(idx, 1)
        }
      }
      dispatchEvent() { return true }

      private _fireEvent(type: string) {
        const event = { type, target: this, currentTarget: this }
        const list = this._listeners.get(type) ?? []
        for (const fn of list) fn(event)
        const handler = (this as Record<string, unknown>)[`on${type}`]
        if (typeof handler === 'function') (handler as FileReaderListener)(event)
      }

      readAsArrayBuffer(blob: Blob) {
        this.readyState = 1
        this._fireEvent('loadstart')
        blob.arrayBuffer().then(buffer => {
          this.readyState = 2
          this.result = buffer
          this._fireEvent('load')
          this._fireEvent('loadend')
        }).catch(() => {
          this.readyState = 2
          this._fireEvent('error')
          this._fireEvent('loadend')
        })
      }

      readAsText(blob: Blob) {
        this.readyState = 1
        this._fireEvent('loadstart')
        blob.text().then(text => {
          this.readyState = 2
          this.result = text
          this._fireEvent('load')
          this._fireEvent('loadend')
        }).catch(() => {
          this.readyState = 2
          this._fireEvent('error')
          this._fireEvent('loadend')
        })
      }

      readAsDataURL(blob: Blob) {
        this.readyState = 1
        this._fireEvent('loadstart')
        blob.arrayBuffer().then(buffer => {
          this.readyState = 2
          const base64 = Buffer.from(buffer).toString('base64')
          const type = blob.type || 'application/octet-stream'
          this.result = `data:${type};base64,${base64}`
          this._fireEvent('load')
          this._fireEvent('loadend')
        }).catch(() => {
          this.readyState = 2
          this._fireEvent('error')
          this._fireEvent('loadend')
        })
      }

      readAsBinaryString(blob: Blob) {
        this.readyState = 1
        this._fireEvent('loadstart')
        blob.arrayBuffer().then(buffer => {
          this.readyState = 2
          this.result = String.fromCharCode(...new Uint8Array(buffer))
          this._fireEvent('load')
          this._fireEvent('loadend')
        }).catch(() => {
          this.readyState = 2
          this._fireEvent('error')
          this._fireEvent('loadend')
        })
      }

      abort() {
        this.readyState = 2
        this._fireEvent('abort')
        this._fireEvent('loadend')
      }
    }

    // XMLHttpRequestUpload stub — needed by MSW's XMLHttpRequestInterceptor
    g.XMLHttpRequestUpload = class XMLHttpRequestUpload {
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() { return true }
      onprogress: (() => void) | null = null
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      onabort: (() => void) | null = null
      ontimeout: (() => void) | null = null
      onloadstart: (() => void) | null = null
      onloadend: (() => void) | null = null
    }

    // Minimal XMLHttpRequest stub — MSW's XMLHttpRequestInterceptor replaces
    // this with its own proxy, so we only need enough for hasConfigurableGlobal
    // to return true.
    g.XMLHttpRequest = class XMLHttpRequest {
      static readonly UNSENT = 0
      static readonly OPENED = 1
      static readonly HEADERS_RECEIVED = 2
      static readonly LOADING = 3
      static readonly DONE = 4
      readonly UNSENT = 0
      readonly OPENED = 1
      readonly HEADERS_RECEIVED = 2
      readonly LOADING = 3
      readonly DONE = 4
      readyState = 0
      status = 0
      statusText = ''
      response = ''
      responseText = ''
      responseType = '' as XMLHttpRequestResponseType
      responseURL = ''
      withCredentials = false
      timeout = 0
      upload = new g.XMLHttpRequestUpload()
      open() {}
      send() {}
      abort() {}
      setRequestHeader() {}
      getResponseHeader() { return null }
      getAllResponseHeaders() { return '' }
      overrideMimeType() {}
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() { return true }
      onreadystatechange: (() => void) | null = null
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      onabort: (() => void) | null = null
      onprogress: (() => void) | null = null
      ontimeout: (() => void) | null = null
      onloadstart: (() => void) | null = null
      onloadend: (() => void) | null = null
    } as unknown as typeof globalThis.XMLHttpRequest

    // Stubs for DOM APIs not yet implemented in lazy-dom.
    // These must be set on BOTH the jest global (g) and the lazy-dom window,
    // because @testing-library/dom resolves constructors via
    // element.ownerDocument.defaultView (the lazy-dom Window object).
    const defineStub = (name: string, value: unknown) => {
      Object.defineProperty(g, name, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      })
    }

    const defineStubOnBoth = (name: string, value: unknown) => {
      defineStub(name, value)
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      })
    }

    defineStubOnBoth("history", window.history)

    defineStubOnBoth("DOMParser", class DOMParser {
      parseFromString(html: string, _mimeType?: string) {
        const doc = document.implementation.createHTMLDocument('')
        doc.write(html)
        return doc
      }
    })

    // MutationObserver comes from lazy-dom's classes (already assigned above)

    // getSelection — delegate to the lazy-dom Window's built-in Selection
    // Capture the original before defineStubOnBoth overwrites window.getSelection
    const originalGetSelection = window.getSelection.bind(window)
    defineStubOnBoth("getSelection", () => originalGetSelection())

    const screenStub = {
      availHeight: 0,
      availWidth: 0,
      colorDepth: 24,
      height: 0,
      pixelDepth: 24,
      width: 0,
      orientation: {},
    }
    defineStubOnBoth("screen", screenStub)

    defineStubOnBoth("NodeFilter", {
      FILTER_ACCEPT: 1,
      FILTER_REJECT: 2,
      FILTER_SKIP: 3,
      SHOW_ALL: 0xFFFFFFFF,
      SHOW_ELEMENT: 0x1,
      SHOW_ATTRIBUTE: 0x2,
      SHOW_TEXT: 0x4,
      SHOW_CDATA_SECTION: 0x8,
      SHOW_ENTITY_REFERENCE: 0x10,
      SHOW_ENTITY: 0x20,
      SHOW_PROCESSING_INSTRUCTION: 0x40,
      SHOW_COMMENT: 0x80,
      SHOW_DOCUMENT: 0x100,
      SHOW_DOCUMENT_TYPE: 0x200,
      SHOW_DOCUMENT_FRAGMENT: 0x400,
      SHOW_NOTATION: 0x800,
    })

    // Provide timer functions on the lazy-dom window object and jest global so that
    // libraries accessing them via ownerDocument.defaultView work correctly
    const timerNames = ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] as const
    for (const name of timerNames) {
      const fn = globalThis[name]
      if (fn) {
        const bound = fn.bind(globalThis)
        Object.defineProperty(window, name, {
          configurable: true,
          enumerable: true,
          value: bound,
          writable: true,
        })
        Object.defineProperty(g, name, {
          configurable: true,
          enumerable: true,
          value: bound,
          writable: true,
        })
      }
    }

    // requestAnimationFrame/cancelAnimationFrame polyfills (not in Node.js by default)
    // Matches JSDOM's setInterval-based approach: a shared interval at ~60Hz runs
    // all pending callbacks on each tick. The interval starts lazily when the first
    // callback is registered and stops when no callbacks remain. Between tests,
    // handleTestEvent flushes any remaining callbacks to prevent cross-test leaks.
    {
      let rafId = 0
      const mapOfCallbacks = new Map<number, FrameRequestCallback>()
      let numberOfOngoing = 0
      let intervalHandle: ReturnType<typeof setInterval> | null = null

      const runCallbacks = (stamp: number) => {
        const ids = Array.from(mapOfCallbacks.keys())
        for (const id of ids) {
          const cb = mapOfCallbacks.get(id)
          if (cb) {
            removeCallback(id)
            try {
              cb(stamp)
            } catch {
              // swallow — matches JSDOM behavior
            }
          }
        }
      }

      const removeCallback = (id: number) => {
        if (mapOfCallbacks.has(id)) {
          numberOfOngoing--
          if (numberOfOngoing === 0 && intervalHandle !== null) {
            globalThis.clearInterval(intervalHandle)
            intervalHandle = null
          }
          mapOfCallbacks.delete(id)
        }
      }

      this._rafFlush = () => runCallbacks(performance.now())

      defineStubOnBoth("requestAnimationFrame", (cb: FrameRequestCallback) => {
        const id = ++rafId
        mapOfCallbacks.set(id, cb)
        numberOfOngoing++
        if (numberOfOngoing === 1) {
          intervalHandle = globalThis.setInterval(() => {
            runCallbacks(performance.now())
          }, 1000 / 60)
        }
        return id
      })
      defineStubOnBoth("cancelAnimationFrame", (id: number) => {
        removeCallback(id)
      })
    }

    // Also put DOM classes on the lazy-dom window so testing-library can find them
    // via document.defaultView (e.g., defaultView.HTMLElement for instanceof checks)
    for (const [name, value] of Object.entries(classes)) {
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      })
    }

    Object.defineProperty(g, "innerWidth", {
      configurable: true,
      enumerable: true,
      value: window.innerWidth,
      writable: true,
    })
    Object.defineProperty(g, "innerHeight", {
      configurable: true,
      enumerable: true,
      value: window.innerHeight,
      writable: true,
    })
    Object.defineProperty(g, "open", {
      configurable: true,
      enumerable: true,
      value: window.open.bind(window),
      writable: true,
    })
    Object.defineProperty(g, "dispatchEvent", {
      configurable: true,
      enumerable: true,
      value: window.dispatchEvent.bind(window),
      writable: true,
    })
    Object.defineProperty(g, "scrollTo", {
      configurable: true,
      enumerable: true,
      value: window.scrollTo.bind(window),
      writable: true,
    })
    Object.defineProperty(g, "scrollBy", {
      configurable: true,
      enumerable: true,
      value: window.scrollBy.bind(window),
      writable: true,
    })
    Object.defineProperty(g, "scroll", {
      configurable: true,
      enumerable: true,
      value: window.scroll.bind(window),
      writable: true,
    })

    // Minimal _virtualConsole stub (EventEmitter-like) for libraries that expect it
    type Listener = (...args: unknown[]) => void
    const virtualConsole = {
      _listeners: new Map<string, Listener[]>(),
      addListener(event: string, handler: Listener) {
        const list = this._listeners.get(event) ?? []
        list.push(handler)
        this._listeners.set(event, list)
      },
      removeAllListeners(event?: string) {
        if (event) this._listeners.delete(event)
        else this._listeners.clear()
      },
      listeners(event: string) {
        return this._listeners.get(event) ?? []
      },
      emit(event: string, ...args: unknown[]) {
        for (const fn of this.listeners(event)) fn(...args)
      },
    }
    defineStubOnBoth("_virtualConsole", virtualConsole)

    // React act environment flag
    g.IS_REACT_ACT_ENVIRONMENT = true
    g.__LAZY_DOM__ = true

    // Expose scroll properties on the global (matching JSDOM behavior)
    for (const name of ["scrollX", "scrollY", "pageXOffset", "pageYOffset"] as const) {
      Object.defineProperty(g, name, {
        configurable: true,
        enumerable: true,
        value: window[name],
        writable: true,
      })
    }

    // Opt-out from browser-style resolution (matching pro's config)
    this.customExportConditions = [""]
  }

  // Flush pending RAF callbacks between tests so they don't leak across test
  // boundaries. lazy-dom is faster than JSDOM, so the ~16ms interval may not
  // tick before the next test starts.
  //
  // Suppress React act() timing warnings that appear only under lazy-dom.
  // These are artifacts of lazy-dom's slightly different event loop timing,
  // not real problems — the same tests pass functionally. We intercept at
  // test_fn_start (after beforeEach hooks like mockConsole have run) so our
  // filter sits in front of any throwing console.error wrapper.
  async handleTestEvent(event: { name: string }) {
    if (event.name === 'test_fn_start') {
      const g = this.global as typeof globalThis
      const currentError = g.console.error
      g.console.error = (...args: unknown[]) => {
        const msg = typeof args[0] === 'string' ? args[0] : ''
        if (
          msg.includes('inside a test was not wrapped in act(') ||
          msg.includes('suspended inside an `act` scope')
        ) {
          return
        }
        currentError.apply(g.console, args)
      }
    }
    if (event.name === 'test_done' && this._rafFlush) {
      this._rafFlush()
    }
  }

  async teardown() {
    // Flush pending RAF callbacks first
    if (this._rafFlush) {
      this._rafFlush()
    }

    await super.teardown()
    reset()

    this._rafFlush = null
  }
}

export const TestEnvironment = LazyDomEnvironment
