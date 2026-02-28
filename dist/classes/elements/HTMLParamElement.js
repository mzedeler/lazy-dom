"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLParamElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLParamElement extends HTMLElement_1.HTMLElement {
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
    get value() {
        return this.getAttribute('value') ?? '';
    }
    set value(value) {
        this.setAttribute('value', value);
    }
    get valueType() {
        return this.getAttribute('valuetype') ?? '';
    }
    set valueType(value) {
        this.setAttribute('valuetype', value);
    }
}
exports.HTMLParamElement = HTMLParamElement;
