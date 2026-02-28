"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLBaseElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLBaseElement extends HTMLElement_1.HTMLElement {
    get href() {
        return this.getAttribute('href') ?? '';
    }
    set href(value) {
        this.setAttribute('href', value);
    }
    get target() {
        return this.getAttribute('target') ?? '';
    }
    set target(value) {
        this.setAttribute('target', value);
    }
}
exports.HTMLBaseElement = HTMLBaseElement;
