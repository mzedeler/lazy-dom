"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLIFrameElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLIFrameElement extends HTMLElement_1.HTMLElement {
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(value) {
        this.setAttribute('align', value);
    }
    get frameBorder() {
        return this.getAttribute('frameborder') ?? '';
    }
    set frameBorder(value) {
        this.setAttribute('frameborder', value);
    }
    get height() {
        return this.getAttribute('height') ?? '';
    }
    set height(value) {
        this.setAttribute('height', value);
    }
    get longDesc() {
        return this.getAttribute('longdesc') ?? '';
    }
    set longDesc(value) {
        this.setAttribute('longdesc', value);
    }
    get marginHeight() {
        return this.getAttribute('marginheight') ?? '';
    }
    set marginHeight(value) {
        this.setAttribute('marginheight', value);
    }
    get marginWidth() {
        return this.getAttribute('marginwidth') ?? '';
    }
    set marginWidth(value) {
        this.setAttribute('marginwidth', value);
    }
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get scrolling() {
        return this.getAttribute('scrolling') ?? '';
    }
    set scrolling(value) {
        this.setAttribute('scrolling', value);
    }
    get src() {
        return this.getAttribute('src') ?? '';
    }
    set src(value) {
        this.setAttribute('src', value);
    }
    get width() {
        return this.getAttribute('width') ?? '';
    }
    set width(value) {
        this.setAttribute('width', value);
    }
}
exports.HTMLIFrameElement = HTMLIFrameElement;
