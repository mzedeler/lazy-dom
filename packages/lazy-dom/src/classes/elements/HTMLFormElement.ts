import { Event } from "../Event"
import { HTMLElement } from "./HTMLElement"
import { HTMLInputElement } from "./HTMLInputElement"
import { HTMLTextAreaElement } from "./HTMLTextAreaElement"
import { HTMLSelectElement } from "./HTMLSelectElement"
import { defineStringReflections } from "../../utils/reflectAttributes"

export class HTMLFormElement extends HTMLElement {
  declare action: string
  declare target: string
  declare name: string
  declare acceptCharset: string

  get method() {
    return this.getAttribute('method') ?? 'get'
  }
  set method(value: string) {
    this.setAttribute('method', value)
  }

  get enctype() {
    return this.getAttribute('enctype') ?? 'application/x-www-form-urlencoded'
  }
  set enctype(value: string) {
    this.setAttribute('enctype', value)
  }

  get elements() {
    return this.querySelectorAll('input, select, textarea, button, fieldset')
  }

  get length() {
    return this.elements.length
  }

  submit() {}

  requestSubmit() {
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    this.dispatchEvent(submitEvent)
  }

  reset() {
    // Reset all form elements to their default values
    const elements = this.querySelectorAll('input, textarea, select')
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]
      if (el instanceof HTMLInputElement) {
        el.value = el.defaultValue
        el.checked = el.defaultChecked
      } else if (el instanceof HTMLTextAreaElement) {
        el.value = el.defaultValue
      } else if (el instanceof HTMLSelectElement) {
        // Reset to default selection
        el.selectedIndex = -1
        const options = el.querySelectorAll('option')
        for (let j = 0; j < options.length; j++) {
          const opt = options[j]
          if (opt.hasAttribute('selected')) {
            el.selectedIndex = j
            break
          }
        }
        if (el.selectedIndex === -1 && options.length > 0) {
          el.selectedIndex = 0
        }
      }
    }
  }
}
defineStringReflections(HTMLFormElement.prototype, [
  ['action', 'action'],
  ['target', 'target'],
  ['name', 'name'],
  ['acceptCharset', 'accept-charset'],
])
