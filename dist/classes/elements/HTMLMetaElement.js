"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLMetaElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLMetaElement extends HTMLElement_1.HTMLElement {
    get content() {
        return this.getAttribute('content') ?? '';
    }
    set content(value) {
        this.setAttribute('content', value);
    }
    get httpEquiv() {
        return this.getAttribute('http-equiv') ?? '';
    }
    set httpEquiv(value) {
        this.setAttribute('http-equiv', value);
    }
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get scheme() {
        return this.getAttribute('scheme') ?? '';
    }
    set scheme(value) {
        this.setAttribute('scheme', value);
    }
}
exports.HTMLMetaElement = HTMLMetaElement;
