"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLBRElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLBRElement extends HTMLElement_1.HTMLElement {
    get clear() {
        return this.getAttribute('clear') ?? '';
    }
    set clear(value) {
        this.setAttribute('clear', value);
    }
}
exports.HTMLBRElement = HTMLBRElement;
