"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLUListElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLUListElement extends HTMLElement_1.HTMLElement {
    get compact() {
        return this.hasAttribute('compact');
    }
    set compact(val) {
        if (val)
            this.setAttribute('compact', '');
        else
            this.removeAttribute('compact');
    }
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
}
exports.HTMLUListElement = HTMLUListElement;
