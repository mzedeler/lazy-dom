// IntersectionObserver stub — lazy-dom has no layout engine, so
// intersection events never fire automatically. Tests that need
// intersection behavior should invoke callbacks manually. This
// implementation provides the correct API surface so code that
// constructs an IntersectionObserver doesn't crash.

export interface IntersectionObserverEntry {
  readonly boundingClientRect: DOMRectReadOnly
  readonly intersectionRatio: number
  readonly intersectionRect: DOMRectReadOnly
  readonly isIntersecting: boolean
  readonly rootBounds: DOMRectReadOnly | null
  readonly target: unknown
  readonly time: number
}

type IntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void

interface IntersectionObserverInit {
  root?: unknown | null
  rootMargin?: string
  threshold?: number | number[]
}

export class IntersectionObserver {
  private _callback: IntersectionObserverCallback
  private _targets = new Set<unknown>()

  readonly root: unknown | null
  readonly rootMargin: string
  readonly thresholds: readonly number[]

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this._callback = callback
    this.root = options?.root ?? null
    this.rootMargin = options?.rootMargin ?? '0px 0px 0px 0px'
    const threshold = options?.threshold ?? 0
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold]
  }

  observe(target: unknown): void {
    this._targets.add(target)
  }

  unobserve(target: unknown): void {
    this._targets.delete(target)
  }

  disconnect(): void {
    this._targets.clear()
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
