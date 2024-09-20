import type { Future } from '../types/Future'

export class FutureContainer<T> {
  #dirty: boolean = false
  #value: Future<T> = () => {
    throw new Error('Value net set error')
  }

  set(updater: (previous: Future<T>) => T): FutureContainer<T> {
    this.#dirty = true
    const previous = this.#value
    this.#value = () => updater(previous)
    return this
  }

  get(): T {
    const value = this.#value()
    if (this.#dirty) {
      this.#value = () => value
      this.#dirty = false
    }
    return value
  }
}
