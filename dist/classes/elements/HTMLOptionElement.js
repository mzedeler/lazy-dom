"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLOptionElement = void 0;
const HTMLElement_1 = require("./HTMLElement");
class HTMLOptionElement extends HTMLElement_1.HTMLElement {
    _selected = false;
    _value = '';
    get form() {
        return null;
    }
    get defaultSelected() {
        return this.hasAttribute('selected');
    }
    set defaultSelected(value) {
        if (value)
            this.setAttribute('selected', '');
        else
            this.removeAttribute('selected');
    }
    get text() {
        return this.textContent ?? '';
    }
    get index() {
        return 0;
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(value) {
        if (value)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }
    get label() {
        return this.getAttribute('label') ?? '';
    }
    set label(value) {
        this.setAttribute('label', value);
    }
    get selected() {
        return this._selected || this.defaultSelected;
    }
    set selected(value) {
        this._selected = value;
    }
    get value() {
        const val = this.getAttribute('value');
        if (val !== null)
            return val;
        return this._value || this.textContent || '';
    }
    set value(v) {
        this._value = v;
        this.setAttribute('value', v);
    }
}
exports.HTMLOptionElement = HTMLOptionElement;
