import { Future } from '../../src/types/Future'
import { Consumer } from './Consumer'

class NaiveStore {
  lookupFuture: Future<Record<string, string>> = () => ({})
}

export class NaiveConsumer implements Consumer {
  naiveStore = new NaiveStore()

  setValue(key: string, value: string) {
    const lookupFuture = this.naiveStore.lookupFuture
    this.naiveStore.lookupFuture = () => {
      const lookup = lookupFuture()
      lookup[key] = value
      return lookup
    }
  }

  getValue(key: string) {
    return this.naiveStore.lookupFuture()[key]
  }
}
