"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLLabelElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLLabelElement extends HTMLElement_1.HTMLElement {
    get htmlFor() {
        return this.getAttribute('for') ?? '';
    }
    set htmlFor(value) {
        this.setAttribute('for', value);
    }
    get form() {
        return null;
    }
    get control() {
        const htmlFor = this.getAttribute('for');
        if (htmlFor) {
            return this.ownerDocument.getElementById(htmlFor);
        }
        return null;
    }
}
exports.HTMLLabelElement = HTMLLabelElement;
