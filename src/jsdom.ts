import lazyDom from "./lazyDom"

export class JSDOM {
  private _window: any

  constructor(_html = "", _options: Record<string, any> = {}) {
    const { window } = lazyDom()
    this._window = window

    // global-jsdom checks for "Node.js" in userAgent
    this._window.navigator = {
      userAgent: `Node.js/${process.versions.node}`,
    }

    if (_options.url) {
      this._window.location = { href: _options.url }
    }
  }

  get window() {
    return this._window
  }

  serialize() {
    return ""
  }
}
