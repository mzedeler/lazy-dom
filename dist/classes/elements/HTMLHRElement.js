"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLHRElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLHRElement extends HTMLElement_1.HTMLElement {
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
    get noShade() {
        return this.hasAttribute('noshade');
    }
    set noShade(value) {
        if (value)
            this.setAttribute('noshade', '');
        else
            this.removeAttribute('noshade');
    }
    get size() {
        return this.getAttribute('size') ?? '';
    }
    set size(value) {
        this.setAttribute('size', value);
    }
    get width() {
        return this.getAttribute('width') ?? '';
    }
    set width(value) {
        this.setAttribute('width', value);
    }
}
exports.HTMLHRElement = HTMLHRElement;
