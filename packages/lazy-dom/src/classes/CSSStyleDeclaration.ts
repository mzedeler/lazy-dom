import { Future } from "../types/Future"

class CSSStyleDeclarationStore {
  properties: Future<Map<string, string>> = () => new Map()
}

export class CSSStyleDeclaration {
  cssStyleDeclarationStore = new CSSStyleDeclarationStore()

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
