"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLTableSectionElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLTableSectionElement extends HTMLElement_1.HTMLElement {
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
    get ch() {
        return this.getAttribute('char') ?? '';
    }
    set ch(value) {
        this.setAttribute('char', value);
    }
    get chOff() {
        return this.getAttribute('charoff') ?? '';
    }
    set chOff(value) {
        this.setAttribute('charoff', value);
    }
    get vAlign() {
        return this.getAttribute('valign') ?? '';
    }
    set vAlign(value) {
        this.setAttribute('valign', value);
    }
    insertRow() { return null; }
    deleteRow() { }
}
exports.HTMLTableSectionElement = HTMLTableSectionElement;
