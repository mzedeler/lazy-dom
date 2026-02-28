"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLTableCaptionElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLTableCaptionElement extends HTMLElement_1.HTMLElement {
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
}
exports.HTMLTableCaptionElement = HTMLTableCaptionElement;
