import { Future } from "../types/Future"
import { Attr } from "./Attr"
import { NamedNodeMap } from "./NamedNodeMap"

interface AttributeStore {
  attributes: Future<NamedNodeMap>
}

export class DOMTokenList {
  private store: AttributeStore

  constructor(store: AttributeStore) {
    this.store = store
  }

  add(...tokens: string[]) {
    const previousAttributesFuture = this.store.attributes
    this.store.attributes = () => {
      const attrs = previousAttributesFuture()
      const existing = attrs.getNamedItem('class')
      const current = existing?.value ?? ''
      const classes = current ? current.split(/\s+/) : []
      let changed = false
      for (const tok of tokens) {
        if (!classes.includes(tok)) {
          classes.push(tok)
          changed = true
        }
      }
      if (changed) {
        attrs.setNamedItem(new Attr(null, 'class', classes.join(' ')))
      }
      return attrs
    }
  }

  remove(...tokens: string[]) {
    const previousAttributesFuture = this.store.attributes
    this.store.attributes = () => {
      const attrs = previousAttributesFuture()
      const existing = attrs.getNamedItem('class')
      if (existing) {
        const removeSet = new Set(tokens)
        const classes = existing.value.split(/\s+/).filter(c => !removeSet.has(c))
        attrs.setNamedItem(new Attr(null, 'class', classes.join(' ')))
      }
      return attrs
    }
  }

  contains(cls: string): boolean {
    const classAttr = this.store.attributes().getNamedItem('class')
    if (!classAttr) return false
    return classAttr.value.split(/\s+/).includes(cls)
  }

  toggle(cls: string) {
    const previousAttributesFuture = this.store.attributes
    this.store.attributes = () => {
      const attrs = previousAttributesFuture()
      const existing = attrs.getNamedItem('class')
      const current = existing?.value ?? ''
      const classes = current ? current.split(/\s+/).filter(Boolean) : []
      if (classes.includes(cls)) {
        attrs.setNamedItem(new Attr(null, 'class', classes.filter(c => c !== cls).join(' ')))
      } else {
        const newValue = current ? current + ' ' + cls : cls
        attrs.setNamedItem(new Attr(null, 'class', newValue))
      }
      return attrs
    }
  }
}
