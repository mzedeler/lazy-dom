"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLMapElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLMapElement extends HTMLElement_1.HTMLElement {
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
}
exports.HTMLMapElement = HTMLMapElement;
