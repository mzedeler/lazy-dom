"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLInputElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLInputElement extends HTMLElement_1.HTMLElement {
    get type() {
        return this.getAttribute('type') ?? 'text';
    }
    set type(value) {
        this.setAttribute('type', value);
    }
    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get value() {
        return this.getAttribute('value') ?? '';
    }
    set value(val) {
        this.setAttribute('value', val);
    }
    get defaultValue() {
        return this.getAttribute('value') ?? '';
    }
    set defaultValue(val) {
        this.setAttribute('value', val);
    }
    get checked() {
        return this.hasAttribute('checked');
    }
    set checked(val) {
        if (val)
            this.setAttribute('checked', '');
        else
            this.removeAttribute('checked');
    }
    get defaultChecked() {
        return this.hasAttribute('checked');
    }
    set defaultChecked(val) {
        if (val)
            this.setAttribute('checked', '');
        else
            this.removeAttribute('checked');
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(val) {
        if (val)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }
    get readOnly() {
        return this.hasAttribute('readonly');
    }
    set readOnly(val) {
        if (val)
            this.setAttribute('readonly', '');
        else
            this.removeAttribute('readonly');
    }
    get maxLength() {
        const val = this.getAttribute('maxlength');
        return val !== null ? parseInt(val, 10) : -1;
    }
    set maxLength(val) {
        this.setAttribute('maxlength', String(val));
    }
    get size() {
        const val = this.getAttribute('size');
        return val !== null ? parseInt(val, 10) : 20;
    }
    set size(val) {
        this.setAttribute('size', String(val));
    }
    get src() {
        return this.getAttribute('src') ?? '';
    }
    set src(val) {
        this.setAttribute('src', val);
    }
    get useMap() {
        return this.getAttribute('usemap') ?? '';
    }
    set useMap(val) {
        this.setAttribute('usemap', val);
    }
    get alt() {
        return this.getAttribute('alt') ?? '';
    }
    set alt(val) {
        this.setAttribute('alt', val);
    }
    get accept() {
        return this.getAttribute('accept') ?? '';
    }
    set accept(val) {
        this.setAttribute('accept', val);
    }
    get align() {
        return this.getAttribute('align') ?? '';
    }
    set align(val) {
        this.setAttribute('align', val);
    }
    get form() {
        return null;
    }
    select() { }
}
exports.HTMLInputElement = HTMLInputElement;
