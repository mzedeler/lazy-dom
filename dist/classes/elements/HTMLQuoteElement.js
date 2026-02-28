"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLQuoteElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLQuoteElement extends HTMLElement_1.HTMLElement {
    get cite() {
        return this.getAttribute('cite') ?? '';
    }
    set cite(value) {
        this.setAttribute('cite', value);
    }
}
exports.HTMLQuoteElement = HTMLQuoteElement;
