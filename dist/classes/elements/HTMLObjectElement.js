"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLObjectElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLObjectElement extends HTMLElement_1.HTMLElement {
    get form() {
        return null;
    }
    get code() {
        return this.getAttribute('code') ?? '';
    }
    set code(value) {
        this.setAttribute('code', value);
    }
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
    get archive() {
        return this.getAttribute('archive') ?? '';
    }
    set archive(value) {
        this.setAttribute('archive', value);
    }
    get border() {
        return this.getAttribute('border') ?? '';
    }
    set border(value) {
        this.setAttribute('border', value);
    }
    get codeBase() {
        return this.getAttribute('codebase') ?? '';
    }
    set codeBase(value) {
        this.setAttribute('codebase', value);
    }
    get codeType() {
        return this.getAttribute('codetype') ?? '';
    }
    set codeType(value) {
        this.setAttribute('codetype', value);
    }
    get data() {
        return this.getAttribute('data') ?? '';
    }
    set data(value) {
        this.setAttribute('data', value);
    }
    get declare() {
        return this.hasAttribute('declare');
    }
    set declare(value) {
        if (value)
            this.setAttribute('declare', '');
        else
            this.removeAttribute('declare');
    }
    get height() {
        return this.getAttribute('height') ?? '';
    }
    set height(value) {
        this.setAttribute('height', value);
    }
    get hspace() {
        const val = this.getAttribute('hspace');
        return val ? parseInt(val, 10) : 0;
    }
    set hspace(value) {
        this.setAttribute('hspace', String(value));
    }
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get standby() {
        return this.getAttribute('standby') ?? '';
    }
    set standby(value) {
        this.setAttribute('standby', value);
    }
    get tabIndex() {
        const val = this.getAttribute('tabindex');
        return val ? parseInt(val, 10) : 0;
    }
    set tabIndex(value) {
        this.setAttribute('tabindex', String(value));
    }
    get type() {
        return this.getAttribute('type') ?? '';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
    get useMap() {
        return this.getAttribute('usemap') ?? '';
    }
    set useMap(value) {
        this.setAttribute('usemap', value);
    }
    get vspace() {
        const val = this.getAttribute('vspace');
        return val ? parseInt(val, 10) : 0;
    }
    set vspace(value) {
        this.setAttribute('vspace', String(value));
    }
    get width() {
        return this.getAttribute('width') ?? '';
    }
    set width(value) {
        this.setAttribute('width', value);
    }
}
exports.HTMLObjectElement = HTMLObjectElement;
