import { Element } from "./Element";

export class HTMLCollection {
  /** @internal */
  _elements: Element[]

  constructor(elements: Element[] = []) {
    this._elements = elements
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === 'string' && /^\d+$/.test(prop)) {
          return target._elements[Number(prop)]
        }
        return Reflect.get(target, prop, receiver)
      },
    })
  }

  get length(): number {
    return this._elements.length
  }

  item(index: number): Element | null {
    return this._elements[index] ?? null
  }

  namedItem(key: string): Element | null {
    return this._elements.find(
      el => el.getAttribute('id') === key || el.getAttribute('name') === key
    ) ?? null
  }

  [Symbol.iterator](): Iterator<Element> {
    return this._elements[Symbol.iterator]()
  }

  [index: number]: Element | undefined
}
