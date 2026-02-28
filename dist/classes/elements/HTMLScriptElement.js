"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLScriptElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLScriptElement extends HTMLElement_1.HTMLElement {
    get text() {
        return this.textContent ?? '';
    }
    set text(value) {
        this.textContent = value;
    }
    get charset() {
        return this.getAttribute('charset') ?? '';
    }
    set charset(value) {
        this.setAttribute('charset', value);
    }
    get defer() {
        return this.hasAttribute('defer');
    }
    set defer(value) {
        if (value)
            this.setAttribute('defer', '');
        else
            this.removeAttribute('defer');
    }
    get event() {
        return this.getAttribute('event') ?? '';
    }
    set event(value) {
        this.setAttribute('event', value);
    }
    get htmlFor() {
        return this.getAttribute('for') ?? '';
    }
    set htmlFor(value) {
        this.setAttribute('for', value);
    }
    get src() {
        return this.getAttribute('src') ?? '';
    }
    set src(value) {
        this.setAttribute('src', value);
    }
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
}
exports.HTMLScriptElement = HTMLScriptElement;
