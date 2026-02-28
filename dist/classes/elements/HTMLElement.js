"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLElement = void 0;
const Element_1 = require("../Element");
class HTMLElement extends Element_1.Element {
    get id() {
        return this.getAttribute('id') ?? '';
    }
    set id(value) {
        this.setAttribute('id', value);
    }
    get title() {
        return this.getAttribute('title') ?? '';
    }
    set title(value) {
        this.setAttribute('title', value);
    }
    get lang() {
        return this.getAttribute('lang') ?? '';
    }
    set lang(value) {
        this.setAttribute('lang', value);
    }
    get dir() {
        return this.getAttribute('dir') ?? '';
    }
    set dir(value) {
        this.setAttribute('dir', value);
    }
    get className() {
        return this.getAttribute('class') ?? '';
    }
    set className(value) {
        this.setAttribute('class', value);
    }
    get tabIndex() {
        const val = this.getAttribute('tabindex');
        return val !== null ? parseInt(val, 10) : -1;
    }
    set tabIndex(value) {
        this.setAttribute('tabindex', String(value));
    }
    get accessKey() {
        return this.getAttribute('accesskey') ?? '';
    }
    set accessKey(value) {
        this.setAttribute('accesskey', value);
    }
    get draggable() {
        return this.getAttribute('draggable') === 'true';
    }
    set draggable(value) {
        this.setAttribute('draggable', String(value));
    }
}
exports.HTMLElement = HTMLElement;
