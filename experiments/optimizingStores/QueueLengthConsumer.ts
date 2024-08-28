import { Future } from '../../src/types/Future'
import { Consumer } from './Consumer'

class NaiveStore {
  lookupFuture: Future<Record<string, string>> = () => ({})
  queueLength: number = 0
}

export class QueueLengthConsumer implements Consumer {
  naiveStore = new NaiveStore()

  setValue(key: string, value: string) {
    const lookupFuture = this.naiveStore.lookupFuture
    this.naiveStore.lookupFuture = () => {
      const lookup = lookupFuture()
      lookup[key] = value
      return lookup
    }
    this.naiveStore.queueLength++
  }

  getValue(key: string) {
    if (this.naiveStore.queueLength > 1) {
      this.naiveStore.queueLength = 0
      const result = this.naiveStore.lookupFuture();
      this.naiveStore.lookupFuture = () => result
      return result[key]  
    }
    return this.naiveStore.lookupFuture()[key]
  }
}
