"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLTableColElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLTableColElement extends HTMLElement_1.HTMLElement {
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
    get span() {
        const val = this.getAttribute('span');
        return val ? parseInt(val, 10) : 1;
    }
    set span(value) {
        this.setAttribute('span', String(value));
    }
    get vAlign() {
        return this.getAttribute('valign') ?? '';
    }
    set vAlign(value) {
        this.setAttribute('valign', value);
    }
    get width() {
        return this.getAttribute('width') ?? '';
    }
    set width(value) {
        this.setAttribute('width', value);
    }
}
exports.HTMLTableColElement = HTMLTableColElement;
