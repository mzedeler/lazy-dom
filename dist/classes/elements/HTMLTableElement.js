"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLTableElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLTableElement extends HTMLElement_1.HTMLElement {
    get caption() {
        return null;
    }
    get tHead() {
        return null;
    }
    get tFoot() {
        return null;
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
    get border() {
        return this.getAttribute('border') ?? '';
    }
    set border(value) {
        this.setAttribute('border', value);
    }
    get cellPadding() {
        return this.getAttribute('cellpadding') ?? '';
    }
    set cellPadding(value) {
        this.setAttribute('cellpadding', value);
    }
    get cellSpacing() {
        return this.getAttribute('cellspacing') ?? '';
    }
    set cellSpacing(value) {
        this.setAttribute('cellspacing', value);
    }
    get frame() {
        return this.getAttribute('frame') ?? '';
    }
    set frame(value) {
        this.setAttribute('frame', value);
    }
    get rules() {
        return this.getAttribute('rules') ?? '';
    }
    set rules(value) {
        this.setAttribute('rules', value);
    }
    get summary() {
        return this.getAttribute('summary') ?? '';
    }
    set summary(value) {
        this.setAttribute('summary', value);
    }
    get width() {
        return this.getAttribute('width') ?? '';
    }
    set width(value) {
        this.setAttribute('width', value);
    }
    createTHead() { return null; }
    deleteTHead() { }
    createTFoot() { return null; }
    deleteTFoot() { }
    createCaption() { return null; }
    deleteCaption() { }
    insertRow() { return null; }
    deleteRow() { }
}
exports.HTMLTableElement = HTMLTableElement;
