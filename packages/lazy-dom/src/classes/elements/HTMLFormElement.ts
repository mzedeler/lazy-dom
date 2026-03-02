import { HTMLElement } from "./HTMLElement"
import { HTMLInputElement } from "./HTMLInputElement"
import { HTMLTextAreaElement } from "./HTMLTextAreaElement"
import { HTMLSelectElement } from "./HTMLSelectElement"

export class HTMLFormElement extends HTMLElement {
  get action() {
    return this.getAttribute('action') ?? ''
  }
  set action(value: string) {
    this.setAttribute('action', value)
  }

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

  get target() {
    return this.getAttribute('target') ?? ''
  }
  set target(value: string) {
    this.setAttribute('target', value)
  }

  get name() {
    return this.getAttribute('name') ?? ''
  }
  set name(value: string) {
    this.setAttribute('name', value)
  }

  get acceptCharset() {
    return this.getAttribute('accept-charset') ?? ''
  }
  set acceptCharset(value: string) {
    this.setAttribute('accept-charset', value)
  }

  get length() {
    return 0
  }

  submit() {}

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
