import type { MutationInit, Observer } from './mutationNotify'
import { registerObserver, unregisterObserver } from './mutationNotify'

export class MutationRecord {
  readonly type: string
  readonly target: unknown
  readonly addedNodes: unknown[]
  readonly removedNodes: unknown[]
  readonly previousSibling: unknown
  readonly nextSibling: unknown
  readonly attributeName: string | null
  readonly attributeNamespace: string | null
  readonly oldValue: string | null

  constructor(init: MutationInit) {
    this.type = init.type
    this.target = init.target
    this.addedNodes = init.addedNodes ?? []
    this.removedNodes = init.removedNodes ?? []
    this.previousSibling = null
    this.nextSibling = null
    this.attributeName = init.attributeName ?? null
    this.attributeNamespace = null
    this.oldValue = init.oldValue ?? null
  }
}

interface MutationObserverInitOptions {
  childList?: boolean
  attributes?: boolean
  characterData?: boolean
  subtree?: boolean
  attributeOldValue?: boolean
  characterDataOldValue?: boolean
  attributeFilter?: string[]
}

type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void

export class MutationObserver implements Observer {
  private _callback: MutationCallback
  private _records: MutationRecord[] = []
  private _targets = new Map<unknown, MutationObserverInitOptions>()
  private _scheduled = false

  constructor(callback: MutationCallback) {
    this._callback = callback
  }

  observe(target: unknown, options: MutationObserverInitOptions) {
    this._targets.set(target, { ...options })
    registerObserver(this)
  }

  disconnect() {
    this._targets.clear()
    this._records = []
    unregisterObserver(this)
  }

  takeRecords(): MutationRecord[] {
    const records = this._records
    this._records = []
    return records
  }

  _matchesTarget(target: { parentNode: unknown }, type: string): boolean {
    // Direct match
    const directOpts = this._targets.get(target)
    if (directOpts && matchesType(directOpts, type)) return true

    // Walk ancestors for subtree observers
    let ancestor = target.parentNode as { parentNode: unknown } | null
    while (ancestor) {
      const opts = this._targets.get(ancestor)
      if (opts && opts.subtree && matchesType(opts, type)) return true
      ancestor = (ancestor as { parentNode: unknown }).parentNode as { parentNode: unknown } | null
    }

    return false
  }

  _queueRecord(init: MutationInit) {
    this._records.push(new MutationRecord(init))
    if (!this._scheduled) {
      this._scheduled = true
      queueMicrotask(() => {
        this._scheduled = false
        if (this._records.length > 0 && this._targets.size > 0) {
          const records = this.takeRecords()
          this._callback(records, this)
        }
      })
    }
  }
}

function matchesType(opts: MutationObserverInitOptions, type: string): boolean {
  if (type === 'childList') return !!opts.childList
  if (type === 'attributes') return !!opts.attributes
  if (type === 'characterData') return !!opts.characterData
  return false
}
