"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMTokenList = void 0;
const Attr_1 = require("./Attr");
class DOMTokenList {
    store;
    constructor(store) {
        this.store = store;
    }
    add(cls) {
        const previousAttributesFuture = this.store.attributes;
        this.store.attributes = () => {
            const attrs = previousAttributesFuture();
            const existing = attrs.getNamedItem('class');
            const current = existing?.value ?? '';
            const classes = current ? current.split(/\s+/) : [];
            if (!classes.includes(cls)) {
                const newValue = current ? current + ' ' + cls : cls;
                attrs.setNamedItem(new Attr_1.Attr(null, 'class', newValue));
            }
            return attrs;
        };
    }
    remove(cls) {
        const previousAttributesFuture = this.store.attributes;
        this.store.attributes = () => {
            const attrs = previousAttributesFuture();
            const existing = attrs.getNamedItem('class');
            if (existing) {
                const classes = existing.value.split(/\s+/).filter(c => c !== cls);
                attrs.setNamedItem(new Attr_1.Attr(null, 'class', classes.join(' ')));
            }
            return attrs;
        };
    }
    contains(cls) {
        const classAttr = this.store.attributes().getNamedItem('class');
        if (!classAttr)
            return false;
        return classAttr.value.split(/\s+/).includes(cls);
    }
    toggle(cls) {
        const previousAttributesFuture = this.store.attributes;
        this.store.attributes = () => {
            const attrs = previousAttributesFuture();
            const existing = attrs.getNamedItem('class');
            const current = existing?.value ?? '';
            const classes = current ? current.split(/\s+/).filter(Boolean) : [];
            if (classes.includes(cls)) {
                attrs.setNamedItem(new Attr_1.Attr(null, 'class', classes.filter(c => c !== cls).join(' ')));
            }
            else {
                const newValue = current ? current + ' ' + cls : cls;
                attrs.setNamedItem(new Attr_1.Attr(null, 'class', newValue));
            }
            return attrs;
        };
    }
}
exports.DOMTokenList = DOMTokenList;
