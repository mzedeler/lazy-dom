export class CSSRule {
  cssText: string
  constructor(cssText: string) {
    this.cssText = cssText
  }
}

export class CSSStyleSheet {
  private _cssRules: CSSRule[] = []
  disabled = false

  get cssRules(): CSSRule[] {
    return this._cssRules
  }

  insertRule(rule: string, index?: number): number {
    const idx = index ?? 0
    const cssRule = new CSSRule(rule)
    this._cssRules.splice(idx, 0, cssRule)
    return idx
  }

  deleteRule(index: number) {
    this._cssRules.splice(index, 1)
  }
}
