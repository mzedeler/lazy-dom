"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLHtmlElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLHtmlElement extends HTMLElement_1.HTMLElement {
    get version() {
        return this.getAttribute('version') ?? '';
    }
    set version(value) {
        this.setAttribute('version', value);
    }
}
exports.HTMLHtmlElement = HTMLHtmlElement;
