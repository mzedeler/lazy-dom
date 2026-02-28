"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLOListElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLOListElement extends HTMLElement_1.HTMLElement {
    get compact() {
        return this.hasAttribute('compact');
    }
    set compact(value) {
        if (value)
            this.setAttribute('compact', '');
        else
            this.removeAttribute('compact');
    }
    get start() {
        const val = this.getAttribute('start');
        return val ? parseInt(val, 10) : 0;
    }
    set start(value) {
        this.setAttribute('start', String(value));
    }
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
}
exports.HTMLOListElement = HTMLOListElement;
