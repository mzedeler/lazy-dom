import lazyDom from "./lazyDom"

export class JSDOM {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _window: any

  constructor(_html = "", _options: Record<string, unknown> = {}) {
    const { window } = lazyDom()
    this._window = window

    // global-jsdom checks for "Node.js" in userAgent
    this._window.navigator = {
      userAgent: `Node.js/${process.versions.node}`,
    }

    if (typeof _options.url === 'string') {
      this._window._setLocationUrl(_options.url)
    }
  }

  get window() {
    return this._window
  }

  serialize() {
    return ""
  }
}
