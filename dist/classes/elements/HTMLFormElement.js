"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLFormElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLFormElement extends HTMLElement_1.HTMLElement {
    get action() {
        return this.getAttribute('action') ?? '';
    }
    set action(value) {
        this.setAttribute('action', value);
    }
    get method() {
        return this.getAttribute('method') ?? 'get';
    }
    set method(value) {
        this.setAttribute('method', value);
    }
    get enctype() {
        return this.getAttribute('enctype') ?? 'application/x-www-form-urlencoded';
    }
    set enctype(value) {
        this.setAttribute('enctype', value);
    }
    get target() {
        return this.getAttribute('target') ?? '';
    }
    set target(value) {
        this.setAttribute('target', value);
    }
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get acceptCharset() {
        return this.getAttribute('accept-charset') ?? '';
    }
    set acceptCharset(value) {
        this.setAttribute('accept-charset', value);
    }
    get length() {
        return 0;
    }
    submit() { }
    reset() { }
}
exports.HTMLFormElement = HTMLFormElement;
