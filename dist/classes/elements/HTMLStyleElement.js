"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLStyleElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLStyleElement extends HTMLElement_1.HTMLElement {
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(value) {
        if (value)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }
    get media() {
        return this.getAttribute('media') ?? '';
    }
    set media(value) {
        this.setAttribute('media', value);
    }
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
}
exports.HTMLStyleElement = HTMLStyleElement;
