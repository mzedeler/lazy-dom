// Lightweight notification registry for MutationObserver.
// Kept separate to avoid circular imports — Node.ts imports this, MutationObserver.ts imports this.

export interface MutationInit {
  type: 'childList' | 'attributes' | 'characterData'
  target: { parentNode: unknown }
  addedNodes?: unknown[]
  removedNodes?: unknown[]
  attributeName?: string | null
  oldValue?: string | null
}

export interface Observer {
  _matchesTarget(target: { parentNode: unknown }, type: string): boolean
  _queueRecord(init: MutationInit): void
}

const activeObservers = new Set<Observer>()

export function registerObserver(obs: Observer) { activeObservers.add(obs) }
export function unregisterObserver(obs: Observer) { activeObservers.delete(obs) }

/** Clear all tracked observers (called by reset between test files). */
export function clearActiveObservers(): void { activeObservers.clear() }

export function notifyMutation(init: MutationInit) {
  if (activeObservers.size === 0) return
  for (const obs of activeObservers) {
    if (obs._matchesTarget(init.target, init.type)) {
      obs._queueRecord(init)
    }
  }
}
