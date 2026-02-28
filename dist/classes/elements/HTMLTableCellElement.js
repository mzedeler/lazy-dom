"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLTableCellElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLTableCellElement extends HTMLElement_1.HTMLElement {
    get cellIndex() {
        return 0;
    }
    get abbr() {
        return this.getAttribute('abbr') ?? '';
    }
    set abbr(value) {
        this.setAttribute('abbr', value);
    }
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
    get axis() {
        return this.getAttribute('axis') ?? '';
    }
    set axis(value) {
        this.setAttribute('axis', value);
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
    get colSpan() {
        const val = this.getAttribute('colspan');
        return val ? parseInt(val, 10) : 1;
    }
    set colSpan(value) {
        this.setAttribute('colspan', String(value));
    }
    get headers() {
        return this.getAttribute('headers') ?? '';
    }
    set headers(value) {
        this.setAttribute('headers', value);
    }
    get height() {
        return this.getAttribute('height') ?? '';
    }
    set height(value) {
        this.setAttribute('height', value);
    }
    get noWrap() {
        return this.hasAttribute('nowrap');
    }
    set noWrap(value) {
        if (value)
            this.setAttribute('nowrap', '');
        else
            this.removeAttribute('nowrap');
    }
    get rowSpan() {
        const val = this.getAttribute('rowspan');
        return val ? parseInt(val, 10) : 1;
    }
    set rowSpan(value) {
        this.setAttribute('rowspan', String(value));
    }
    get scope() {
        return this.getAttribute('scope') ?? '';
    }
    set scope(value) {
        this.setAttribute('scope', value);
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
exports.HTMLTableCellElement = HTMLTableCellElement;
