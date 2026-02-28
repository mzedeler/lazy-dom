"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLDivElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLDivElement extends HTMLElement_1.HTMLElement {
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
}
exports.HTMLDivElement = HTMLDivElement;
