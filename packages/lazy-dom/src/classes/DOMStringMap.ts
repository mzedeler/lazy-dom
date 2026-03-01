import { Future } from "../types/Future"
import { Attr } from "./Attr"
import { NamedNodeMap } from "./NamedNodeMap"

interface AttributeStore {
  attributes: Future<NamedNodeMap>
}

function toAttrName(prop: string): string {
  return 'data-' + prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}

export class DOMStringMap {
  private store: AttributeStore

  constructor(store: AttributeStore) {
    this.store = store
    return new Proxy(this, {
      get(_target, prop: string) {
        if (prop in _target) return (_target as Record<string, unknown>)[prop]
        return _target.get(prop)
      },
      set(_target, prop: string, value: string) {
        _target.set(prop, value)
        return true
      }
    })
  }

  private get(prop: string): string | undefined {
    const attr = this.store.attributes().getNamedItem(toAttrName(prop))
    return attr?.value ?? undefined
  }

  private set(prop: string, value: string) {
    const attrName = toAttrName(prop)
    const previousAttributesFuture = this.store.attributes
    this.store.attributes = () => {
      const attrs = previousAttributesFuture()
      attrs.setNamedItem(new Attr(null, attrName, value))
      return attrs
    }
  }
}
