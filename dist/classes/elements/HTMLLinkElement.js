"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLLinkElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLLinkElement extends HTMLElement_1.HTMLElement {
    get charset() {
        return this.getAttribute('charset') ?? '';
    }
    set charset(value) {
        this.setAttribute('charset', value);
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(value) {
        if (value)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }
    get href() {
        return this.getAttribute('href') ?? '';
    }
    set href(value) {
        this.setAttribute('href', value);
    }
    get hreflang() {
        return this.getAttribute('hreflang') ?? '';
    }
    set hreflang(value) {
        this.setAttribute('hreflang', value);
    }
    get media() {
        return this.getAttribute('media') ?? '';
    }
    set media(value) {
        this.setAttribute('media', value);
    }
    get rel() {
        return this.getAttribute('rel') ?? '';
    }
    set rel(value) {
        this.setAttribute('rel', value);
    }
    get rev() {
        return this.getAttribute('rev') ?? '';
    }
    set rev(value) {
        this.setAttribute('rev', value);
    }
    get target() {
        return this.getAttribute('target') ?? '';
    }
    set target(value) {
        this.setAttribute('target', value);
    }
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
}
exports.HTMLLinkElement = HTMLLinkElement;
