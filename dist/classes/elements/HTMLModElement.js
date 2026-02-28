"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLModElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLModElement extends HTMLElement_1.HTMLElement {
    get cite() {
        return this.getAttribute('cite') ?? '';
    }
    set cite(value) {
        this.setAttribute('cite', value);
    }
    get dateTime() {
        return this.getAttribute('datetime') ?? '';
    }
    set dateTime(value) {
        this.setAttribute('datetime', value);
    }
}
exports.HTMLModElement = HTMLModElement;
