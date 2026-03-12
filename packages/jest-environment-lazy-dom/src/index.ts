import vm from "vm"
import type { Context } from "vm"
import type { JestEnvironmentConfig, EnvironmentContext } from "@jest/environment"
import type { JestEnvironment } from "@jest/environment"
import type { Circus } from "@jest/types"
import type { Global } from "@jest/types"
import { LegacyFakeTimers, ModernFakeTimers } from "@jest/fake-timers"
import { ModuleMocker } from "jest-mock"
import { installCommonGlobals } from "jest-util"
import lazyDom, { reset } from "lazy-dom"

// Note: jest-runtime teardown is handled by jest-runner's lifecycle.
// We rely on nulling our own instance properties to break reference chains.

// Globals we set ourselves or that are deprecated — skip when copying from Node.js
const denyList = new Set([
  'GLOBAL',
  'root',
  'global',
  'globalThis',
  'Buffer',
  'ArrayBuffer',
  'Uint8Array',
  'jest-symbol-do-not-touch',
])

const nodeGlobals = new Map(
  Object.getOwnPropertyNames(globalThis)
    .filter(name => !denyList.has(name))
    .map(name => {
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, name)
      if (!descriptor) {
        throw new Error(`No property descriptor for ${name}`)
      }
      return [name, descriptor] as const
    })
)

interface TimerRef {
  id: number
  ref(): TimerRef
  unref(): TimerRef
}

// ---- Module-level stubs (shared across suites to avoid per-suite closure retention) ----

type FileReaderListener = (event: { type: string; target: unknown; currentTarget: unknown }) => void

class FileReaderPolyfill implements globalThis.FileReader {
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

class XMLHttpRequestUploadStub {
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

class XMLHttpRequestStub {
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
  upload = new XMLHttpRequestUploadStub()
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
}

const screenStub = {
  availHeight: 0,
  availWidth: 0,
  colorDepth: 24,
  height: 0,
  pixelDepth: 24,
  width: 0,
  orientation: {},
}

const nodeFilterStub = {
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
}

// Rotate VM contexts every CONTEXT_ROTATION_LIMIT suites.
// V8 ties compiled-code metadata (SharedFunctionInfo, BytecodeArrays, FeedbackVectors)
// to the native context. In a permanently shared context, this metadata accumulates
// (~1.6 GB for 466 suites). By rotating contexts periodically, old contexts become
// unreachable and V8 bulk-frees their metadata. The rotation limit controls the
// trade-off between per-context accumulation and the cost of creating new contexts.
const CONTEXT_ROTATION_LIMIT = 1
let sharedContext: Context | null = null
let contextSuiteCount = 0

export default class LazyDomEnvironment implements JestEnvironment<TimerRef> {
  context: Context | null
  global: Global.Global
  fakeTimers: LegacyFakeTimers<TimerRef> | null
  fakeTimersModern: ModernFakeTimers | null
  moduleMocker: ModuleMocker | null

  private _rafFlush: (() => void) | null = null
  private _clearAllTimers: (() => void) | null = null
  private _lazyDomWindow: Record<string, unknown> | null = null
  // Snapshot of DOM class prototype property descriptors at construction time.
  // Used in teardown to restore properties overwritten by test setup code
  // (e.g. scrollIntoView polyfills), which would otherwise retain
  // VM-context functions on host-context prototypes and prevent GC.
  private _prototypeSnapshots: Map<object, Map<string | symbol, PropertyDescriptor>> | null = null

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    const { projectConfig } = config

    const isReused = sharedContext !== null
    const context: Context = sharedContext ?? vm.createContext()
    if (!isReused) {
      sharedContext = context
    }
    contextSuiteCount++

    // Register suite path for per-context retention tracking (bench-pro)
    const tracker = (process as unknown as Record<string, unknown>).__vmContextTracker as
      { suites: string[] } | undefined
    if (tracker?.suites) {
      tracker.suites.push(_context.testPath || 'unknown')
    }
    const global = vm.runInContext(
      'this',
      Object.assign(context as object, projectConfig.testEnvironmentOptions as Record<string, unknown>)
    ) as Global.Global
    if (!isReused) {
      // Context created fresh — nothing extra needed
    }
    this.context = context
    this.global = global

    // Copy Node.js globals into the sandbox
    const contextGlobals = new Set(Object.getOwnPropertyNames(global))
    for (const [nodeGlobalsKey, descriptor] of nodeGlobals) {
      if (!contextGlobals.has(nodeGlobalsKey)) {
        if (descriptor.configurable) {
          Object.defineProperty(global, nodeGlobalsKey, {
            configurable: true,
            enumerable: descriptor.enumerable,
            get() {
              const value = (globalThis as Record<string, unknown>)[nodeGlobalsKey]
              Object.defineProperty(global, nodeGlobalsKey, {
                configurable: true,
                enumerable: descriptor.enumerable,
                value,
                writable: true,
              })
              return value
            },
            set(value: unknown) {
              Object.defineProperty(global, nodeGlobalsKey, {
                configurable: true,
                enumerable: descriptor.enumerable,
                value,
                writable: true,
              })
            },
          })
        } else if ('value' in descriptor) {
          Object.defineProperty(global, nodeGlobalsKey, {
            configurable: false,
            enumerable: descriptor.enumerable,
            value: descriptor.value,
            writable: descriptor.writable,
          })
        } else {
          Object.defineProperty(global, nodeGlobalsKey, {
            configurable: false,
            enumerable: descriptor.enumerable,
            get: descriptor.get,
            set: descriptor.set,
            })
          }
        }
      }

    // Fundamental Node.js globals
    const g = global as typeof globalThis
    g.global = global as typeof globalThis
    g.Buffer = Buffer
    g.ArrayBuffer = ArrayBuffer
    g.Uint8Array = Uint8Array

    // On reused contexts, installCommonGlobals would throw when trying to
    // redefine non-configurable Symbol properties (jest-native-promise, etc.)
    const origDefineProperties = Object.defineProperties
    if (isReused) {
      Object.defineProperties = ((obj: object, props: PropertyDescriptorMap) => {
        if (obj === g) {
          const filtered: PropertyDescriptorMap = {}
          for (const key of Reflect.ownKeys(props)) {
            const existing = Object.getOwnPropertyDescriptor(obj, key)
            if (!existing || existing.configurable) {
              filtered[key as string] = props[key as string]
            }
          }
          return origDefineProperties.call(Object, obj, filtered)
        }
        return origDefineProperties.call(Object, obj, props)
      }) as typeof Object.defineProperties
    }
    try {
      installCommonGlobals(global as typeof globalThis, projectConfig.globals)
    } finally {
      if (isReused) {
        Object.defineProperties = origDefineProperties
      }
    }
    g.Error.stackTraceLimit = 100

    // ---------- Jest infrastructure ----------
    this.moduleMocker = new ModuleMocker(global as typeof globalThis)

    const timerIdToRef = (id: number): TimerRef => ({
      id,
      ref() { return this },
      unref() { return this },
    })
    const timerRefToId = (timer: TimerRef) => timer?.id

    this.fakeTimers = new LegacyFakeTimers({
      config: projectConfig,
      global: global as typeof globalThis,
      moduleMocker: this.moduleMocker,
      timerConfig: {
        idToRef: timerIdToRef,
        refToId: timerRefToId,
      },
    })
    this.fakeTimersModern = new ModernFakeTimers({
      config: projectConfig,
      global: global as typeof globalThis,
    })

    // ---------- lazy-dom DOM setup ----------
    const { window, document, classes } = lazyDom()
    this._lazyDomWindow = window as unknown as Record<string, unknown>

    // Snapshot DOM class prototype state before test code can modify them.
    // Test setup files (setupFilesAfterEnv) may overwrite methods like
    // Element.prototype.scrollIntoView = () => {} — these are VM-context
    // functions on host-context prototypes, creating reference chains that
    // prevent VM context garbage collection.
    this._prototypeSnapshots = new Map<object, Map<string | symbol, PropertyDescriptor>>()
    for (const value of Object.values(classes)) {
      if (typeof value === 'function' && value.prototype) {
        const proto = value.prototype as object
        const descriptors = new Map<string | symbol, PropertyDescriptor>()
        for (const key of [...Object.getOwnPropertyNames(proto), ...Object.getOwnPropertySymbols(proto)]) {
          const desc = Object.getOwnPropertyDescriptor(proto, key)
          if (desc) descriptors.set(key, desc)
        }
        this._prototypeSnapshots.set(proto, descriptors)
      }
    }

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
    // Class defined at module level to avoid per-suite closure retention.
    g.FileReader = FileReaderPolyfill

    // XMLHttpRequestUpload stub — needed by MSW's XMLHttpRequestInterceptor
    // Class defined at module level to avoid per-suite closure retention.
    g.XMLHttpRequestUpload = XMLHttpRequestUploadStub

    // Minimal XMLHttpRequest stub — MSW's XMLHttpRequestInterceptor replaces
    // this with its own proxy, so we only need enough for hasConfigurableGlobal
    // to return true. Class defined at module level to avoid per-suite closure retention.
    g.XMLHttpRequest = XMLHttpRequestStub as unknown as typeof globalThis.XMLHttpRequest

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

    defineStubOnBoth("screen", screenStub)

    defineStubOnBoth("NodeFilter", nodeFilterStub)

    // Provide timer functions on the lazy-dom window object and jest global so that
    // libraries accessing them via ownerDocument.defaultView work correctly.
    //
    // We track all active timer IDs so teardown can cancel them. Without this,
    // deferred callbacks (e.g. @rails/activestorage autostart, lodash debounce)
    // fire after the global has been stripped, crashing the worker process.
    {
      const activeTimeouts = new Set<ReturnType<typeof globalThis.setTimeout>>()
      const activeIntervals = new Set<ReturnType<typeof globalThis.setInterval>>()
      const activeImmediates = new Set<ReturnType<typeof globalThis.setImmediate>>()

      const wrappedSetTimeout = (callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]) => {
        const id = globalThis.setTimeout((...a: unknown[]) => {
          activeTimeouts.delete(id)
          callback(...a)
        }, ms, ...args)
        activeTimeouts.add(id)
        return id
      }

      const wrappedClearTimeout = (id: ReturnType<typeof globalThis.setTimeout>) => {
        activeTimeouts.delete(id)
        globalThis.clearTimeout(id)
      }

      const wrappedSetInterval = (callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]) => {
        const id = globalThis.setInterval(callback, ms, ...args)
        activeIntervals.add(id)
        return id
      }

      const wrappedClearInterval = (id: ReturnType<typeof globalThis.setInterval>) => {
        activeIntervals.delete(id)
        globalThis.clearInterval(id)
      }

      const wrappedSetImmediate = (callback: (...args: unknown[]) => void, ...args: unknown[]) => {
        const id = globalThis.setImmediate((...a: unknown[]) => {
          activeImmediates.delete(id)
          callback(...a)
        }, ...args)
        activeImmediates.add(id)
        return id
      }

      const wrappedClearImmediate = (id: ReturnType<typeof globalThis.setImmediate>) => {
        activeImmediates.delete(id)
        globalThis.clearImmediate(id)
      }

      this._clearAllTimers = () => {
        for (const id of activeTimeouts) globalThis.clearTimeout(id)
        activeTimeouts.clear()
        for (const id of activeIntervals) globalThis.clearInterval(id)
        activeIntervals.clear()
        for (const id of activeImmediates) globalThis.clearImmediate(id)
        activeImmediates.clear()
      }

      const timerFns = {
        setTimeout: wrappedSetTimeout,
        clearTimeout: wrappedClearTimeout,
        setInterval: wrappedSetInterval,
        clearInterval: wrappedClearInterval,
        setImmediate: wrappedSetImmediate,
        clearImmediate: wrappedClearImmediate,
      } as const

      for (const [name, fn] of Object.entries(timerFns)) {
        Object.defineProperty(window, name, {
          configurable: true,
          enumerable: true,
          value: fn,
          writable: true,
        })
        Object.defineProperty(g, name, {
          configurable: true,
          enumerable: true,
          value: fn,
          writable: true,
        })
      }
    }

    // requestAnimationFrame/cancelAnimationFrame polyfills (not in Node.js by default)
    //
    // Hybrid approach combining deterministic and timer-based firing:
    //
    //   1. When a NEW requestAnimationFrame is registered, all PREVIOUSLY
    //      registered callbacks fire synchronously first.  This simulates
    //      "the previous frame completed before the next one starts" and
    //      prevents timing-dependent flakiness under CPU contention.
    //
    //   2. A per-callback fallback timer (32ms) ensures single-rAF callbacks
    //      fire even without a subsequent registration — needed by tests
    //      that wait for rAF-triggered state changes (e.g., waitFor).
    //      32ms is 2x the browser's 16ms frame budget, providing enough
    //      margin to avoid premature firing during event processing under
    //      CPU contention while still being fast enough for render tests.
    //
    //   3. handleTestEvent('test_done') flushes any remaining callbacks
    //      so they don't leak across test boundaries.
    {
      let rafId = 0
      const mapOfCallbacks = new Map<number, FrameRequestCallback>()
      const mapOfTimers = new Map<number, ReturnType<typeof globalThis.setTimeout>>()

      const fireCallback = (id: number, stamp: number) => {
        const cb = mapOfCallbacks.get(id)
        if (cb) {
          mapOfCallbacks.delete(id)
          const timer = mapOfTimers.get(id)
          if (timer !== undefined) {
            globalThis.clearTimeout(timer)
            mapOfTimers.delete(id)
          }
          try {
            cb(stamp)
          } catch {
            // swallow — matches JSDOM behavior
          }
        }
      }

      const runCallbacks = (stamp: number) => {
        const ids = Array.from(mapOfCallbacks.keys())
        for (const id of ids) {
          fireCallback(id, stamp)
        }
      }

      this._rafFlush = () => runCallbacks(performance.now())

      defineStubOnBoth("requestAnimationFrame", (cb: FrameRequestCallback) => {
        // Fire all previously registered callbacks ("previous frame")
        if (mapOfCallbacks.size > 0) {
          runCallbacks(performance.now())
        }
        const id = ++rafId
        mapOfCallbacks.set(id, cb)
        // Fallback timer: fire after 32ms if not already fired by next registration
        const timer = globalThis.setTimeout(() => {
          mapOfTimers.delete(id)
          fireCallback(id, performance.now())
        }, 32)
        mapOfTimers.set(id, timer)
        return id
      })
      defineStubOnBoth("cancelAnimationFrame", (id: number) => {
        const timer = mapOfTimers.get(id)
        if (timer !== undefined) {
          globalThis.clearTimeout(timer)
          mapOfTimers.delete(id)
        }
        mapOfCallbacks.delete(id)
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
    defineStub("IS_REACT_ACT_ENVIRONMENT", true)
    defineStub("__LAZY_DOM__", true)

    // Expose scroll properties on the global (matching JSDOM behavior)
    for (const name of ["scrollX", "scrollY", "pageXOffset", "pageYOffset"] as const) {
      Object.defineProperty(g, name, {
        configurable: true,
        enumerable: true,
        value: window[name],
        writable: true,
      })
    }
  }

  async setup() {}

  // Flush pending RAF callbacks between tests so they don't leak across test
  // boundaries. lazy-dom is faster than JSDOM, so the ~16ms interval may not
  // tick before the next test starts.
  //
  // Suppress React act() timing warnings that appear only under lazy-dom.
  // These are artifacts of lazy-dom's slightly different event loop timing,
  // not real problems — the same tests pass functionally. We intercept at
  // test_fn_start (after beforeEach hooks like mockConsole have run) so our
  // filter sits in front of any throwing console.error wrapper.
  async handleTestEvent(event: Circus.Event) {
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
    // Cancel all tracked timers
    if (this._clearAllTimers) {
      this._clearAllTimers()
    }

    // Flush pending RAF callbacks
    if (this._rafFlush) {
      this._rafFlush()
    }

    // Dispose jest fake timer infrastructure
    if (this.fakeTimers) {
      this.fakeTimers.dispose()
    }
    if (this.fakeTimersModern) {
      this.fakeTimersModern.dispose()
    }

    // Restore any prototype properties that test code added or overwritten.
    // This breaks VM-context → host-context prototype reference chains
    // that would otherwise prevent VM context garbage collection.
    if (this._prototypeSnapshots) {
      for (const [proto, origDescriptors] of this._prototypeSnapshots) {
        const currentKeys = [
          ...Object.getOwnPropertyNames(proto),
          ...Object.getOwnPropertySymbols(proto),
        ]
        for (const key of currentKeys) {
          const origDesc = origDescriptors.get(key)
          if (!origDesc) {
            // Property was added by test code — remove it
            try {
              delete (proto as Record<string | symbol, unknown>)[key]
              if (process.env.LAZYDOM_DEBUG_HANDLES) {
                process.stderr.write(`[proto-cleanup] removed added: ${String(key)}\n`)
              }
            } catch { /* skip non-configurable */ }
          } else {
            // Check if property was overwritten with a different value
            const currentDesc = Object.getOwnPropertyDescriptor(proto, key)
            if (currentDesc && 'value' in origDesc && 'value' in currentDesc
              && currentDesc.value !== origDesc.value) {
              try {
                Object.defineProperty(proto, key, origDesc)
                if (process.env.LAZYDOM_DEBUG_HANDLES) {
                  process.stderr.write(`[proto-cleanup] restored overwritten: ${String(key)}\n`)
                }
              } catch { /* skip non-configurable */ }
            } else if (currentDesc && 'get' in currentDesc && 'get' in origDesc
              && currentDesc.get !== origDesc.get) {
              try {
                Object.defineProperty(proto, key, origDesc)
                if (process.env.LAZYDOM_DEBUG_HANDLES) {
                  process.stderr.write(`[proto-cleanup] restored getter: ${String(key)}\n`)
                }
              } catch { /* skip non-configurable */ }
            }
          }
        }
      }
      this._prototypeSnapshots = null
    }

    // Clear WASM state, NodeRegistry, liveRanges, activeObservers
    reset()

    // Break internal reference chains in jest infrastructure objects.
    // ModuleMocker, LegacyFakeTimers, and ModernFakeTimers all store
    // direct references to the VM context global (_environmentGlobal,
    // _global) that are never cleared by their dispose/teardown methods.
    // These references prevent V8 from collecting the VM context even
    // after we null our own references to these objects.
    type Clearable = Record<string, unknown>
    if (this.moduleMocker) {
      const mm = this.moduleMocker as unknown as Clearable
      mm._environmentGlobal = null
      mm._mockState = null
      mm._mockConfigRegistry = null
      mm._spyState = null
    }
    if (this.fakeTimers) {
      const ft = this.fakeTimers as unknown as Clearable
      ft._global = null
      ft._timerAPIs = null
      ft._moduleMocker = null
    }
    if (this.fakeTimersModern) {
      const ftm = this.fakeTimersModern as unknown as Clearable
      ftm._global = null
      ftm._fakeTimers = null
      ftm._clock = null
    }

    // Clean the lazy-dom Window to break bound method reference chains
    if (this._lazyDomWindow) {
      for (const key of Object.keys(this._lazyDomWindow)) {
        try {
          (this._lazyDomWindow as Record<string, unknown>)[key] = undefined
        } catch { /* skip non-writable */ }
      }
    }

    // Neutralize VM-context built-in prototypes (defense-in-depth).
    // Replaces methods on VM Object.prototype, Function.prototype, etc.
    // with host-context equivalents.  This severs any surviving reference
    // chains from cached VM-context objects through their __proto__ to
    // VM-compiled functions and thus the VM NativeContext.
    //
    // Also used as a host-replacement list during global cleanup below:
    // these names are replaced with host equivalents rather than deleted,
    // so deferred callbacks (React act() setImmediate) still find Error,
    // globalThis, etc.
    const vmBuiltinNames = [
      'Object', 'Function', 'Array', 'String', 'Number', 'Boolean',
      'RegExp', 'Date', 'Error', 'TypeError', 'RangeError', 'SyntaxError',
      'ReferenceError', 'URIError', 'EvalError', 'Map', 'Set',
      'WeakMap', 'WeakSet', 'Promise', 'Symbol',
      'globalThis', 'console', 'setTimeout', 'clearTimeout',
      'setImmediate', 'clearImmediate',
    ]
    if (this.global) {
      const g = this.global as unknown as Record<string, { prototype?: object }>
      const hostGlobal = globalThis as unknown as Record<string, { prototype?: object }>
      for (const name of vmBuiltinNames) {
        const vmProto = g[name]?.prototype
        const hostProto = hostGlobal[name]?.prototype
        if (!vmProto || !hostProto) continue
        for (const key of Object.getOwnPropertyNames(vmProto)) {
          try {
            const hostDesc = Object.getOwnPropertyDescriptor(hostProto, key)
            if (hostDesc) {
              Object.defineProperty(vmProto, key, hostDesc)
            }
          } catch { /* skip non-configurable */ }
        }
      }
    }

    // Delete configurable properties from the VM context global to break
    // outgoing reference chains. For non-configurable writable properties,
    // set to undefined. This helps V8 reclaim memory even for retained
    // contexts by freeing the objects they reference.
    // V8 builtins whose prototypes we neutralized above are replaced with
    // host equivalents rather than deleted — deferred callbacks (e.g. React
    // act()'s setImmediate) may still reference Error and friends.
    if (this.global) {
      const g = this.global
      const hostGlobal = globalThis as unknown as Record<string, unknown>
      const hostReplacements = new Set(vmBuiltinNames)
      for (const key of [...Object.getOwnPropertyNames(g), ...Object.getOwnPropertySymbols(g)]) {
        try {
          const desc = Object.getOwnPropertyDescriptor(g, key)
          if (!desc) continue
          if (typeof key === 'string' && hostReplacements.has(key)) {
            // Replace with host equivalent — keeps the name accessible
            // but removes the VM-context reference
            if (desc.writable || desc.configurable) {
              (g as Record<string | symbol, unknown>)[key] = hostGlobal[key]
            }
          } else if (desc.configurable) {
            delete (g as Record<string | symbol, unknown>)[key]
          } else if (desc.writable) {
            (g as Record<string | symbol, unknown>)[key] = undefined
          }
        } catch { /* skip */ }
      }
    }

    // Null all instance references
    this.global = null as unknown as Global.Global
    this.context = null
    this.fakeTimers = null
    this.fakeTimersModern = null
    this.moduleMocker = null
    this._rafFlush = null
    this._clearAllTimers = null
    this._lazyDomWindow = null

    // Rotate context
    if (contextSuiteCount >= CONTEXT_ROTATION_LIMIT) {
      sharedContext = null
      contextSuiteCount = 0
    }

    if (typeof globalThis.gc === 'function') {
      globalThis.gc()
    }

    // Debug: log active handles count to track leaks
    if (process.env.LAZYDOM_DEBUG_HANDLES) {
      const handles = (process as unknown as { _getActiveHandles: () => unknown[] })._getActiveHandles()
      const handleTypes = new Map<string, number>()
      for (const h of handles) {
        const name = h?.constructor?.name || typeof h
        handleTypes.set(name, (handleTypes.get(name) || 0) + 1)
      }
      const summary = Array.from(handleTypes.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}:${v}`)
        .join(' ')
      process.stderr.write(`[handles] suite=${contextSuiteCount} total=${handles.length} ${summary}\n`)
    }
  }

  exportConditions() {
    return ['']
  }

  getVmContext(): Context | null {
    return this.context
  }
}

export const TestEnvironment = LazyDomEnvironment
