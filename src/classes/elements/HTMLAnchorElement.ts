import { HTMLElement } from "./HTMLElement"

export class HTMLAnchorElement extends HTMLElement {
  get href() {
    return new URL(this.attributes.getNamedItem('href').value).href
  }

  get pathname() {
    return new URL(this.attributes.getNamedItem('href').value).href
  }

  get protocol() {
    return new URL(this.attributes.getNamedItem('href').value).protocol
  }

  get host() {
    return new URL(this.attributes.getNamedItem('href').value).host
  }

  get search() {
    return new URL(this.attributes.getNamedItem('href').value).search
  }

  get hash() {
    return new URL(this.attributes.getNamedItem('href').value).hash
  }

  get hostname() {
    return new URL(this.attributes.getNamedItem('href').value).hostname
  }
}
