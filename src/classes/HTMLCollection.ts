import { Element } from "./Element";

export abstract class HTMLCollection {
  abstract get length(): number
  abstract item(index: number): Element | null
  abstract namedItem(key: string): Element | null
}
