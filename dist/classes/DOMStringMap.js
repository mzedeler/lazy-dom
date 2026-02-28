"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMStringMap = void 0;
const Attr_1 = require("./Attr");
function toAttrName(prop) {
    return 'data-' + prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}
class DOMStringMap {
    store;
    constructor(store) {
        this.store = store;
        return new Proxy(this, {
            get(_target, prop) {
                if (prop in _target)
                    return _target[prop];
                return _target.get(prop);
            },
            set(_target, prop, value) {
                _target.set(prop, value);
                return true;
            }
        });
    }
    get(prop) {
        const attr = this.store.attributes().getNamedItem(toAttrName(prop));
        return attr?.value ?? undefined;
    }
    set(prop, value) {
        const attrName = toAttrName(prop);
        const previousAttributesFuture = this.store.attributes;
        this.store.attributes = () => {
            const attrs = previousAttributesFuture();
            attrs.setNamedItem(new Attr_1.Attr(null, attrName, value));
            return attrs;
        };
    }
}
exports.DOMStringMap = DOMStringMap;
