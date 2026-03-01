import { HTMLElement } from "./HTMLElement"
import { CSSStyleSheet } from "../CSSStyleSheet"

export class HTMLStyleElement extends HTMLElement {
  private _sheet = new CSSStyleSheet()

  get sheet(): CSSStyleSheet {
    return this._sheet
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get media() {
    return this.getAttribute('media') ?? ''
  }
  set media(value: string) {
    this.setAttribute('media', value)
  }

  get type() {
    return this.getAttribute('type') ?? ''
  }
  set type(value: string) {
    this.setAttribute('type', value)
  }
}
