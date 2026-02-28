"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLDListElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLDListElement extends HTMLElement_1.HTMLElement {
    get compact() {
        return this.hasAttribute('compact');
    }
    set compact(value) {
        if (value)
            this.setAttribute('compact', '');
        else
            this.removeAttribute('compact');
    }
}
exports.HTMLDListElement = HTMLDListElement;
