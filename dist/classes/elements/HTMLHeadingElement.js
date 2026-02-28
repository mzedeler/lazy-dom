"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLHeadingElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLHeadingElement extends HTMLElement_1.HTMLElement {
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
}
exports.HTMLHeadingElement = HTMLHeadingElement;
