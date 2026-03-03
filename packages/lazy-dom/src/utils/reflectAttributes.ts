interface ElementLike {
  getAttribute(name: string): string | null
  setAttribute(name: string, value: string): void
  hasAttribute(name: string): boolean
  removeAttribute(name: string): void
}

/**
 * Define string-reflected properties on an element prototype.
 * Each entry is [propertyName, attributeName, defaultValue?].
 * Default value defaults to '' if omitted.
 */
export function defineStringReflections(
  prototype: ElementLike,
  reflections: ReadonlyArray<readonly [propertyName: string, attributeName: string, defaultValue?: string]>,
): void {
  for (const [propertyName, attributeName, defaultValue = ''] of reflections) {
    Object.defineProperty(prototype, propertyName, {
      get(this: ElementLike) {
        return this.getAttribute(attributeName) ?? defaultValue
      },
      set(this: ElementLike, value: string) {
        this.setAttribute(attributeName, value)
      },
      enumerable: true,
      configurable: true,
    })
  }
}

/**
 * Define boolean-reflected properties on an element prototype.
 * Each entry is [propertyName, attributeName].
 */
export function defineBooleanReflections(
  prototype: ElementLike,
  reflections: ReadonlyArray<readonly [propertyName: string, attributeName: string]>,
): void {
  for (const [propertyName, attributeName] of reflections) {
    Object.defineProperty(prototype, propertyName, {
      get(this: ElementLike) {
        return this.hasAttribute(attributeName)
      },
      set(this: ElementLike, value: boolean) {
        if (value) {
          this.setAttribute(attributeName, '')
        } else {
          this.removeAttribute(attributeName)
        }
      },
      enumerable: true,
      configurable: true,
    })
  }
}

/**
 * Define numeric-reflected properties on an element prototype.
 * Each entry is [propertyName, attributeName, defaultValue?].
 * Default value defaults to 0 if omitted.
 */
export function defineNumericReflections(
  prototype: ElementLike,
  reflections: ReadonlyArray<readonly [propertyName: string, attributeName: string, defaultValue?: number]>,
): void {
  for (const [propertyName, attributeName, defaultValue = 0] of reflections) {
    Object.defineProperty(prototype, propertyName, {
      get(this: ElementLike) {
        const val = this.getAttribute(attributeName)
        if (val === null) return defaultValue
        const parsed = parseInt(val, 10)
        return isNaN(parsed) ? defaultValue : parsed
      },
      set(this: ElementLike, value: number) {
        this.setAttribute(attributeName, String(value))
      },
      enumerable: true,
      configurable: true,
    })
  }
}
