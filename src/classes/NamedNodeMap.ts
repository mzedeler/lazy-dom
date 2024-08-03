import { Future } from "../types/Future"
import { Attr } from "./Attr"

class NamedNodeMapStore {
  itemsLookup: Future<Record<string, Attr>> = () => ({})
}

export class NamedNodeMap extends Array {
  namedNodeMapStore = new NamedNodeMapStore()

  get length() {
    return Object.keys(this.namedNodeMapStore.itemsLookup()).length
  }

  setNamedItem(attr: Attr) {
    const itemsFuture = this.namedNodeMapStore.itemsLookup
    this.namedNodeMapStore.itemsLookup = () => Object.assign(itemsFuture(), {[attr.name]: attr})
  }

  getNamedItem(name: string): Attr {
    return this.namedNodeMapStore.itemsLookup()[name]
  }

  removeNamedItem(name: string) {
    const previousItems = this.namedNodeMapStore.itemsLookup
    this.namedNodeMapStore.itemsLookup = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[name]: _deleted_, ...result } = previousItems()
      return result
    }
  }

  *[Symbol.iterator]() {
    const items = this.namedNodeMapStore.itemsLookup()
    for (const value of Object.values(items)) {
      yield value
    }
  } 
}