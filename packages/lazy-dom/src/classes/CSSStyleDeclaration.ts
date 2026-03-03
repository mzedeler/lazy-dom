import { Future } from "../types/Future"
import { isValidCSSProperty } from "./validCSSProperties"

// Convert camelCase to kebab-case: "textDecoration" → "text-decoration"
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}

// CSS properties that accept length values and should normalize "0" → "0px"
const lengthProperties = new Set([
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'top', 'right', 'bottom', 'left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius',
  'font-size', 'line-height', 'letter-spacing', 'word-spacing', 'text-indent',
  'outline-width', 'outline-offset',
  'gap', 'row-gap', 'column-gap',
  'flex-basis',
  'grid-template-columns', 'grid-template-rows',
  'grid-column-gap', 'grid-row-gap',
  'perspective',
  'border-spacing',
  'background-size', 'background-position',
  'transform-origin',
  'scroll-margin', 'scroll-padding',
])

function normalizeCSSValue(property: string, value: string): string {
  if (value === '0' && lengthProperties.has(property)) {
    return '0px'
  }
  return value
}

class CSSStyleDeclarationStore {
  properties: Future<Map<string, string>> = () => new Map()
  // Raw attribute string set via setAttribute('style', ...) — returned by getAttribute('style')
  // Cleared when style is modified via the JS API (style.color = 'red', etc.)
  rawAttributeValue: string | null = null
  // Tracks whether a CSS property was ever set to a non-empty value via JS API.
  // When true, the style attribute persists as style="" even when all properties are removed.
  hadProperty = false
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
        // Silently ignore non-standard CSS properties (matches JSDOM/cssstyle behavior)
        if (!isValidCSSProperty(kebab)) return true
        // Modifying via JS API clears the raw attribute
        target.cssStyleDeclarationStore.rawAttributeValue = null
        const isNonEmpty = value !== null && value !== undefined && value !== ''
        if (isNonEmpty) target.cssStyleDeclarationStore.hadProperty = true
        const previousPropertiesFuture = target.cssStyleDeclarationStore.properties
        target.cssStyleDeclarationStore.properties = () => {
          const properties = previousPropertiesFuture()
          if (!isNonEmpty) {
            properties.delete(kebab)
          } else {
            properties.set(kebab, normalizeCSSValue(kebab, String(value)))
          }
          return properties
        }
        return true
      },
    })
  }

  setProperty(property: string, value: string | null) {
    // Silently ignore non-standard CSS properties (matches JSDOM/cssstyle behavior)
    if (!isValidCSSProperty(property)) return
    // Modifying via JS API clears the raw attribute
    this.cssStyleDeclarationStore.rawAttributeValue = null
    const isNonEmpty = value !== null && value !== ''
    if (isNonEmpty) this.cssStyleDeclarationStore.hadProperty = true
    const previousPropertiesFuture = this.cssStyleDeclarationStore.properties
    this.cssStyleDeclarationStore.properties = () => {
      const properties = previousPropertiesFuture()
      if (!isNonEmpty) {
        properties.delete(property)
      } else {
        properties.set(property, normalizeCSSValue(property, value))
      }
      return properties
    }
  }

  getPropertyValue(property: string): string {
    return this.cssStyleDeclarationStore.properties().get(property) ?? ''
  }

  removeProperty(property: string): string {
    const oldValue = this.getPropertyValue(property)
    // Modifying via JS API clears the raw attribute
    this.cssStyleDeclarationStore.rawAttributeValue = null
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
      parts.push(`${key}: ${value};`)
    })
    return parts.join(' ')
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
          newProps.set(prop, normalizeCSSValue(prop, val))
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
