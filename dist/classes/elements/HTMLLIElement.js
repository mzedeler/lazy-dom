"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLLIElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLLIElement extends HTMLElement_1.HTMLElement {
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
    get value() {
        const val = this.getAttribute('value');
        return val !== null ? parseInt(val, 10) : 0;
    }
    set value(val) {
        this.setAttribute('value', String(val));
    }
}
exports.HTMLLIElement = HTMLLIElement;
