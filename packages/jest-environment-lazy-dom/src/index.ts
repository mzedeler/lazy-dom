import NodeEnvironment from "jest-environment-node"
import type { EnvironmentContext } from "@jest/environment"
import type { JestEnvironmentConfig } from "@jest/environment"
import lazyDom from "lazy-dom"

export default class LazyDomEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context)

    const { window, document, classes } = lazyDom()

    const g = this.global

    // Event-related classes that should NOT be placed on the jest global.
    // Native EventTarget rejects non-native Event instances, so we keep the
    // native Event hierarchy on `g` and only expose lazy-dom's versions on
    // the lazy-dom `window` (where testing-library finds them via defaultView).
    const eventClassNames = new Set([
      'Event', 'UIEvent', 'MouseEvent', 'KeyboardEvent', 'InputEvent',
      'FocusEvent', 'PointerEvent', 'ProgressEvent', 'ErrorEvent',
      'CustomEvent', 'CompositionEvent',
    ])

    // Assign all DOM classes onto the global (except Event classes)
    for (const [name, value] of Object.entries(classes)) {
      if (eventClassNames.has(name)) continue
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
      parseFromString() {
        return document
      }
    })

    defineStubOnBoth("MutationObserver", class MutationObserver {
      observe() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    })

    // Selection API implementation
    // Uses `unknown` for node types because this bridges the global DOM Node type
    // with lazy-dom's internal Node type — they are structurally compatible at
    // runtime but TypeScript sees them as distinct nominal types.
    type AnyNode = unknown
    type RangeInstance = { setStart(n: AnyNode, o: number): void; setEnd(n: AnyNode, o: number): void; startContainer: AnyNode; startOffset: number; endContainer: AnyNode; endOffset: number; toString(): string }
    const RangeClass = classes.Range as new () => RangeInstance
    const DOCUMENT_POSITION_FOLLOWING = 0x04
    const DOCUMENT_POSITION_CONTAINED_BY = 0x10

    const createSelectionObject = () => {
      const ranges: RangeInstance[] = []
      let anchorNode: AnyNode = null
      let anchorOffset = 0
      let focusNode: AnyNode = null
      let focusOffset = 0

      const sel = {
        get anchorNode() { return anchorNode },
        get anchorOffset() { return anchorOffset },
        get focusNode() { return focusNode },
        get focusOffset() { return focusOffset },
        get rangeCount() { return ranges.length },
        get isCollapsed() { return anchorNode === focusNode && anchorOffset === focusOffset },
        get type() {
          if (ranges.length === 0) return "None"
          return sel.isCollapsed ? "Caret" : "Range"
        },
        addRange(range: RangeInstance) {
          ranges.push(range)
          if (!anchorNode) {
            anchorNode = range.startContainer
            anchorOffset = range.startOffset
            focusNode = range.endContainer
            focusOffset = range.endOffset
          }
        },
        removeAllRanges() {
          ranges.length = 0
          anchorNode = null
          anchorOffset = 0
          focusNode = null
          focusOffset = 0
        },
        getRangeAt(index: number) {
          if (index < 0 || index >= ranges.length) {
            throw new DOMException("Index out of range", "IndexSizeError")
          }
          return ranges[index]
        },
        setPosition(node: AnyNode, offset = 0) {
          sel.removeAllRanges()
          if (!node) return
          anchorNode = node
          anchorOffset = offset
          focusNode = node
          focusOffset = offset
          const range = new RangeClass()
          range.setStart(node, offset)
          range.setEnd(node, offset)
          ranges.push(range)
        },
        collapse(node: AnyNode, offset = 0) {
          sel.setPosition(node, offset)
        },
        extend(node: AnyNode, offset = 0) {
          focusNode = node
          focusOffset = offset
          if (ranges.length > 0) {
            const range = ranges[0]
            if (anchorNode === node) {
              if (offset >= anchorOffset) {
                range.setEnd(node, offset)
              } else {
                range.setStart(node, offset)
              }
            } else if (anchorNode) {
              const pos = (anchorNode as { compareDocumentPosition(n: AnyNode): number }).compareDocumentPosition(node)
              if (pos & DOCUMENT_POSITION_FOLLOWING || pos & DOCUMENT_POSITION_CONTAINED_BY) {
                range.setEnd(node, offset)
              } else {
                range.setStart(node, offset)
              }
            }
          }
        },
        setBaseAndExtent(aNode: AnyNode, aOffset: number, fNode: AnyNode, fOffset: number) {
          sel.removeAllRanges()
          anchorNode = aNode
          anchorOffset = aOffset
          focusNode = fNode
          focusOffset = fOffset
          const range = new RangeClass()
          if (aNode === fNode) {
            range.setStart(aNode, Math.min(aOffset, fOffset))
            range.setEnd(aNode, Math.max(aOffset, fOffset))
          } else {
            const pos = (aNode as { compareDocumentPosition(n: AnyNode): number }).compareDocumentPosition(fNode)
            if (pos & DOCUMENT_POSITION_FOLLOWING || pos & DOCUMENT_POSITION_CONTAINED_BY) {
              range.setStart(aNode, aOffset)
              range.setEnd(fNode, fOffset)
            } else {
              range.setStart(fNode, fOffset)
              range.setEnd(aNode, aOffset)
            }
          }
          ranges.push(range)
        },
        collapseToStart() {
          if (ranges.length > 0) sel.setPosition(ranges[0].startContainer, ranges[0].startOffset)
        },
        collapseToEnd() {
          if (ranges.length > 0) sel.setPosition(ranges[0].endContainer, ranges[0].endOffset)
        },
        selectAllChildren() {},
        deleteFromDocument() {},
        containsNode() { return false },
        toString() {
          return ranges.map(r => r.toString()).join('')
        },
      }
      return sel
    }

    const selectionInstance = createSelectionObject()
    const getSelectionStub = () => selectionInstance

    // getSelection is accessed as both window.getSelection() and document.getSelection()
    defineStubOnBoth("getSelection", getSelectionStub)
    Object.defineProperty(document, "getSelection", {
      configurable: true,
      enumerable: true,
      value: getSelectionStub,
      writable: true,
    })

    const screenStub = {
      availHeight: 768,
      availWidth: 1024,
      colorDepth: 24,
      height: 768,
      pixelDepth: 24,
      width: 1024,
      orientation: { type: "landscape-primary", angle: 0 },
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
    const timerNames = ["setTimeout", "clearTimeout", "setInterval", "clearInterval",
                        "requestAnimationFrame", "cancelAnimationFrame"] as const
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

    // Opt-out from browser-style resolution (matching pro's config)
    this.customExportConditions = [""]
  }
}

export const TestEnvironment = LazyDomEnvironment
