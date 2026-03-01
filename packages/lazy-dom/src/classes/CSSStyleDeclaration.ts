import { Future } from "../types/Future"

// Convert camelCase to kebab-case: "textDecoration" → "text-decoration"
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}

class CSSStyleDeclarationStore {
  properties: Future<Map<string, string>> = () => new Map()
}

// Known methods and properties that should NOT be treated as CSS property access
const ownMembers = new Set([
  'cssStyleDeclarationStore',
  'setProperty',
  'getPropertyValue',
  'removeProperty',
  'cssText',
  'length',
  'item',
])

export class CSSStyleDeclaration {
  cssStyleDeclarationStore = new CSSStyleDeclarationStore()

  constructor() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === 'symbol' || ownMembers.has(prop as string)) {
          return Reflect.get(target, prop, receiver)
        }
        // For any string property not in ownMembers, treat as a CSS property lookup
        const key = prop as string
        // Convert camelCase to kebab-case for the internal map
        const kebab = camelToKebab(key)
        return target.cssStyleDeclarationStore.properties().get(kebab) ?? ''
      },
      set(target, prop, value, receiver) {
        if (typeof prop === 'symbol' || ownMembers.has(prop as string)) {
          return Reflect.set(target, prop, value, receiver)
        }
        const key = prop as string
        const kebab = camelToKebab(key)
        const previousPropertiesFuture = target.cssStyleDeclarationStore.properties
        target.cssStyleDeclarationStore.properties = () => {
          const properties = previousPropertiesFuture()
          if (value === null || value === '') {
            properties.delete(kebab)
          } else {
            properties.set(kebab, String(value))
          }
          return properties
        }
        return true
      },
    })
  }

  setProperty(property: string, value: string | null) {
    const previousPropertiesFuture = this.cssStyleDeclarationStore.properties
    this.cssStyleDeclarationStore.properties = () => {
      const properties = previousPropertiesFuture()
      if (value === null || value === '') {
        properties.delete(property)
      } else {
        properties.set(property, value)
      }
      return properties
    }
  }

  getPropertyValue(property: string): string {
    return this.cssStyleDeclarationStore.properties().get(property) ?? ''
  }

  removeProperty(property: string): string {
    const oldValue = this.getPropertyValue(property)
    const previousPropertiesFuture = this.cssStyleDeclarationStore.properties
    this.cssStyleDeclarationStore.properties = () => {
      const properties = previousPropertiesFuture()
      properties.delete(property)
      return properties
    }
    return oldValue
  }

  get cssText(): string {
    const properties = this.cssStyleDeclarationStore.properties()
    const parts: string[] = []
    properties.forEach((value, key) => {
      parts.push(`${key}: ${value}`)
    })
    return parts.join('; ')
  }

  set cssText(text: string) {
    const newProps = new Map<string, string>()
    if (text) {
      for (const declaration of text.split(';')) {
        const trimmed = declaration.trim()
        if (!trimmed) continue
        const colonIndex = trimmed.indexOf(':')
        if (colonIndex >= 0) {
          const prop = trimmed.substring(0, colonIndex).trim()
          const val = trimmed.substring(colonIndex + 1).trim()
          newProps.set(prop, val)
        }
      }
    }
    this.cssStyleDeclarationStore.properties = () => newProps
  }

  get length(): number {
    return this.cssStyleDeclarationStore.properties().size
  }

  item(index: number): string {
    const keys = Array.from(this.cssStyleDeclarationStore.properties().keys())
    return keys[index] ?? ''
  }
}
