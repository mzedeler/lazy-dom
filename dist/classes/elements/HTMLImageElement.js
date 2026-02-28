"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLImageElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLImageElement extends HTMLElement_1.HTMLElement {
    get src() {
        return this.getAttribute('src') ?? '';
    }
    set src(value) {
        this.setAttribute('src', value);
    }
    get alt() {
        return this.getAttribute('alt') ?? '';
    }
    set alt(value) {
        this.setAttribute('alt', value);
    }
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get width() {
        const val = this.getAttribute('width');
        return val !== null ? parseInt(val, 10) : 0;
    }
    set width(value) {
        this.setAttribute('width', String(value));
    }
    get height() {
        const val = this.getAttribute('height');
        return val !== null ? parseInt(val, 10) : 0;
    }
    set height(value) {
        this.setAttribute('height', String(value));
    }
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
    get longDesc() {
        return this.getAttribute('longdesc') ?? '';
    }
    set longDesc(value) {
        this.setAttribute('longdesc', value);
    }
    get isMap() {
        return this.hasAttribute('ismap');
    }
    set isMap(value) {
        if (value)
            this.setAttribute('ismap', '');
        else
            this.removeAttribute('ismap');
    }
    get useMap() {
        return this.getAttribute('usemap') ?? '';
    }
    set useMap(value) {
        this.setAttribute('usemap', value);
    }
    get border() {
        return this.getAttribute('border') ?? '';
    }
    set border(value) {
        this.setAttribute('border', value);
    }
    get hspace() {
        const val = this.getAttribute('hspace');
        return val !== null ? parseInt(val, 10) : 0;
    }
    set hspace(value) {
        this.setAttribute('hspace', String(value));
    }
    get vspace() {
        const val = this.getAttribute('vspace');
        return val !== null ? parseInt(val, 10) : 0;
    }
    set vspace(value) {
        this.setAttribute('vspace', String(value));
    }
    get lowSrc() {
        return this.getAttribute('lowsrc') ?? '';
    }
    set lowSrc(value) {
        this.setAttribute('lowsrc', value);
    }
}
exports.HTMLImageElement = HTMLImageElement;
