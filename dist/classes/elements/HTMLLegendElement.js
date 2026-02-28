"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLLegendElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLLegendElement extends HTMLElement_1.HTMLElement {
    get form() {
        return null;
    }
    get accessKey() {
        return this.getAttribute('accesskey') ?? '';
    }
    set accessKey(value) {
        this.setAttribute('accesskey', value);
    }
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
}
exports.HTMLLegendElement = HTMLLegendElement;
