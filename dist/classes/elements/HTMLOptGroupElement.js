"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLOptGroupElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLOptGroupElement extends HTMLElement_1.HTMLElement {
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(value) {
        if (value)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }
    get label() {
        return this.getAttribute('label') ?? '';
    }
    set label(value) {
        this.setAttribute('label', value);
    }
}
exports.HTMLOptGroupElement = HTMLOptGroupElement;
