import { Future } from "../types/Future"
import { isValidCSSProperty } from "./validCSSProperties"

// Convert camelCase to kebab-case: "textDecoration" → "text-decoration"
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}

// Properties where cssstyle (v2.3) rejects a plain "0" value
const rejectsPlainZero = new Set([
  'background',
])

// CSS global keywords
const globalKeywords = new Set([
  'inherit', 'initial', 'unset', 'revert', 'revert-layer',
])

// Properties where cssstyle v2.3 rejects CSS global keywords like 'inherit'.
// Most properties accept them, but these specific ones don't due to cssstyle's
// per-property parser implementation.
const rejectsGlobalKeywords = new Set([
  'color', 'background', 'font', 'font-size', 'border',
  'border-color', 'border-width', 'border-style',
  'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'top', 'left', 'right', 'bottom',
  'opacity', 'flex', 'flex-grow', 'flex-shrink',
])

// CSS properties that accept length values and should normalize "0" → "0px"
const lengthProperties = new Set([
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'top', 'right', 'bottom', 'left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
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

// Parse a hex color string to rgb() format, matching cssstyle v2.3 behavior
function hexToRgb(hex: string): string | null {
  let r: number, g: number, b: number
  if (hex.length === 4) {
    // #RGB → #RRGGBB
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16)
    g = parseInt(hex.substring(3, 5), 16)
    b = parseInt(hex.substring(5, 7), 16)
  } else {
    return null
  }
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return `rgb(${r}, ${g}, ${b})`
}

function normalizeCSSValue(property: string, value: string): string {
  // CSS custom properties preserve their values verbatim
  if (property.startsWith('--')) return value
  if (value === '0' && lengthProperties.has(property)) {
    return '0px'
  }
  // Normalize url() values: strip inner quotes to match JSDOM/cssstyle output
  // url("foo") or url('foo') → url(foo)
  if (value.includes('url(')) {
    return value.replace(/url\(\s*["']([^"']+)["']\s*\)/g, 'url($1)')
  }
  // Normalize hex colors to rgb() format (cssstyle v2.3 behavior)
  if (/^#[0-9a-fA-F]{3}$/.test(value) || /^#[0-9a-fA-F]{6}$/.test(value)) {
    const rgb = hexToRgb(value)
    if (rgb) return rgb
  }
  return value
}

// Check if a url() value has spaces (cssstyle v2.3 rejects these even when quoted)
function hasUrlSpaces(value: string): boolean {
  const match = /url\(\s*([^)]+)\s*\)/.exec(value)
  if (!match) return false
  let inner = match[1].trim()
  // Strip quotes to check the actual URL
  if ((inner.startsWith('"') && inner.endsWith('"')) ||
      (inner.startsWith("'") && inner.endsWith("'"))) {
    inner = inner.slice(1, -1)
  }
  return inner.includes(' ')
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
        // Return non-standard properties as plain JS own-properties (matches JSDOM behavior)
        if (!isValidCSSProperty(kebab)) return Reflect.get(target, prop, receiver)
        return target.cssStyleDeclarationStore.properties().get(kebab) ?? ''
      },
      set(target, prop, value, receiver) {
        if (typeof prop === 'symbol' || ownMembers.has(prop as string)) {
          return Reflect.set(target, prop, value, receiver)
        }
        const key = prop as string
        const kebab = camelToKebab(key)
        // Store non-standard CSS properties as plain JS own-properties (matches JSDOM behavior)
        if (!isValidCSSProperty(kebab)) return Reflect.set(target, prop, value, receiver)
        // Reject non-primitive values (prevents [object Object] in cssText)
        if (value !== null && value !== undefined && value !== '' && typeof value === 'object') return true
        const strValue = value !== null && value !== undefined ? String(value) : ''
        // Reject stringified objects that leaked into CSS values
        if (strValue.includes('[object ')) return true
        // Reject plain "0" for properties that don't accept it
        if (strValue === '0' && rejectsPlainZero.has(kebab)) return true
        // Reject CSS global keywords for properties that cssstyle v2.3 rejects them for
        if (globalKeywords.has(strValue) && rejectsGlobalKeywords.has(kebab)) return true
        // Reject url() values with unquoted spaces (cssstyle v2.3 behavior)
        if (hasUrlSpaces(strValue)) return true
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
    // Reject plain "0" for properties that don't accept it
    if (value === '0' && rejectsPlainZero.has(property)) return
    // Reject CSS global keywords for properties that cssstyle v2.3 rejects them for
    if (value !== null && globalKeywords.has(value) && rejectsGlobalKeywords.has(property)) return
    // Reject url() values with unquoted spaces (cssstyle v2.3 behavior)
    if (value !== null && hasUrlSpaces(value)) return
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
          // Apply the same validation as setProperty
          if (!isValidCSSProperty(prop)) continue
          if (globalKeywords.has(val) && rejectsGlobalKeywords.has(prop)) continue
          if (val === '0' && rejectsPlainZero.has(prop)) continue
          if (val.includes('[object ')) continue
          if (hasUrlSpaces(val)) continue
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
