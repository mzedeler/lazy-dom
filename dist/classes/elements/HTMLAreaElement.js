"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLAreaElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLAreaElement extends HTMLElement_1.HTMLElement {
    get accessKey() {
        return this.getAttribute('accesskey') ?? '';
    }
    set accessKey(value) {
        this.setAttribute('accesskey', value);
    }
    get alt() {
        return this.getAttribute('alt') ?? '';
    }
    set alt(value) {
        this.setAttribute('alt', value);
    }
    get coords() {
        return this.getAttribute('coords') ?? '';
    }
    set coords(value) {
        this.setAttribute('coords', value);
    }
    get href() {
        return this.getAttribute('href') ?? '';
    }
    set href(value) {
        this.setAttribute('href', value);
    }
    get noHref() {
        return this.hasAttribute('nohref');
    }
    set noHref(value) {
        if (value)
            this.setAttribute('nohref', '');
        else
            this.removeAttribute('nohref');
    }
    get shape() {
        return this.getAttribute('shape') ?? '';
    }
    set shape(value) {
        this.setAttribute('shape', value);
    }
    get tabIndex() {
        const val = this.getAttribute('tabindex');
        return val ? parseInt(val, 10) : 0;
    }
    set tabIndex(value) {
        this.setAttribute('tabindex', String(value));
    }
    get target() {
        return this.getAttribute('target') ?? '';
    }
    set target(value) {
        this.setAttribute('target', value);
    }
}
exports.HTMLAreaElement = HTMLAreaElement;
