import { Future } from '../../src/types/Future'
import { Consumer } from './Consumer'

class NaiveStore {
  lookupFuture: Future<Record<string, string>> = () => ({})
}

export class ResetNaiveConsumer implements Consumer {
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
    const result = this.naiveStore.lookupFuture();
    this.naiveStore.lookupFuture = () => result
    return result[key]
  }
}
