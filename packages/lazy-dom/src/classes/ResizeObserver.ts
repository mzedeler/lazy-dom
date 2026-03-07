// ResizeObserver stub — lazy-dom has no layout engine, so resize events
// never fire automatically. Tests that need resize behavior should invoke
// callbacks manually via the mock helper pattern. This implementation
// provides the correct API surface so code that constructs a ResizeObserver
// and calls observe/unobserve/disconnect doesn't crash.

interface ResizeObserverSize {
  readonly blockSize: number
  readonly inlineSize: number
}

export interface ResizeObserverEntry {
  readonly target: unknown
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize: readonly ResizeObserverSize[]
  readonly contentBoxSize: readonly ResizeObserverSize[]
  readonly devicePixelContentBoxSize: readonly ResizeObserverSize[]
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

interface ResizeObserverOptions {
  box?: 'content-box' | 'border-box' | 'device-pixel-content-box'
}

export class ResizeObserver {
  private _callback: ResizeObserverCallback
  private _targets = new Set<unknown>()

  constructor(callback: ResizeObserverCallback) {
    this._callback = callback
  }

  observe(target: unknown, _options?: ResizeObserverOptions): void {
    this._targets.add(target)
  }

  unobserve(target: unknown): void {
    this._targets.delete(target)
  }

  disconnect(): void {
    this._targets.clear()
  }
}
