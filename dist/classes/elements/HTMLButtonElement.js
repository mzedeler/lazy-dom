"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLButtonElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLButtonElement extends HTMLElement_1.HTMLElement {
    get type() {
        return this.getAttribute('type') ?? 'submit';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get value() {
        return this.getAttribute('value') ?? '';
    }
    set value(val) {
        this.setAttribute('value', val);
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(val) {
        if (val)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }
    get form() {
        return null;
    }
}
exports.HTMLButtonElement = HTMLButtonElement;
