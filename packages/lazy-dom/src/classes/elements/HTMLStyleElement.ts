import { HTMLElement } from "./HTMLElement"
import { CSSStyleSheet } from "../CSSStyleSheet"
import { defineStringReflections, defineBooleanReflections } from "../../utils/reflectAttributes"

export class HTMLStyleElement extends HTMLElement {
  private _sheet = new CSSStyleSheet()
  declare disabled: boolean
  declare media: string
  declare type: string

  get sheet(): CSSStyleSheet {
    return this._sheet
  }
}
defineStringReflections(HTMLStyleElement.prototype, [
  ['media', 'media'],
  ['type', 'type'],
])
defineBooleanReflections(HTMLStyleElement.prototype, [
  ['disabled', 'disabled'],
])
