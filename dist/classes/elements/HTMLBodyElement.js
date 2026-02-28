"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLBodyElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLBodyElement extends HTMLElement_1.HTMLElement {
    constructor() {
        super();
        this.elementStore.tagName = () => 'body';
    }
    get aLink() {
        return this.getAttribute('alink') ?? '';
    }
    set aLink(value) {
        this.setAttribute('alink', value);
    }
    get background() {
        return this.getAttribute('background') ?? '';
    }
    set background(value) {
        this.setAttribute('background', value);
    }
    get bgColor() {
        return this.getAttribute('bgcolor') ?? '';
    }
    set bgColor(value) {
        this.setAttribute('bgcolor', value);
    }
    get link() {
        return this.getAttribute('link') ?? '';
    }
    set link(value) {
        this.setAttribute('link', value);
    }
    get text() {
        return this.getAttribute('text') ?? '';
    }
    set text(value) {
        this.setAttribute('text', value);
    }
    get vLink() {
        return this.getAttribute('vlink') ?? '';
    }
    set vLink(value) {
        this.setAttribute('vlink', value);
    }
}
exports.HTMLBodyElement = HTMLBodyElement;
