"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLTitleElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLTitleElement extends HTMLElement_1.HTMLElement {
    get text() {
        return this.textContent ?? '';
    }
    set text(value) {
        this.textContent = value;
    }
}
exports.HTMLTitleElement = HTMLTitleElement;
