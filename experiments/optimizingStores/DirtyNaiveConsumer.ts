import { Future } from '../../src/types/Future'
import { Consumer } from './Consumer'

class NaiveStore {
  lookupFuture: Future<Record<string, string>> = () => ({})
  dirty: boolean = false
}

export class DirtyNaiveConsumer implements Consumer {
  naiveStore = new NaiveStore()

  setValue(key: string, value: string) {
    const lookupFuture = this.naiveStore.lookupFuture
    this.naiveStore.dirty = true
    this.naiveStore.lookupFuture = () => {
      const lookup = lookupFuture()
      lookup[key] = value
      return lookup
    }
  }

  getValue(key: string) {
    if (this.naiveStore.dirty) {
      const result = this.naiveStore.lookupFuture();
      this.naiveStore.lookupFuture = () => result
      this.naiveStore.dirty = false
      return result[key]
    }
    return this.naiveStore.lookupFuture()[key]
  }
}
