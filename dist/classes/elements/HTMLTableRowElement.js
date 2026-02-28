"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLTableRowElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLTableRowElement extends HTMLElement_1.HTMLElement {
    get rowIndex() {
        return -1;
    }
    get sectionRowIndex() {
        return -1;
    }
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
    get bgColor() {
        return this.getAttribute('bgcolor') ?? '';
    }
    set bgColor(value) {
        this.setAttribute('bgcolor', value);
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
    insertCell() { return null; }
    deleteCell() { }
}
exports.HTMLTableRowElement = HTMLTableRowElement;
