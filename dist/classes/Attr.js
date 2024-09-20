"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attr = void 0;
var Attr = /** @class */ (function () {
    function Attr(ownerElement, localName, value) {
        this.namespaceURI = null;
        this.prefix = null;
        this.specified = true;
        this.ownerElement = ownerElement;
        this.localName = localName;
        this.value = value;
    }
    Object.defineProperty(Attr.prototype, "name", {
        get: function () {
            return this.localName;
        },
        enumerable: false,
        configurable: true
    });
    return Attr;
}());
exports.Attr = Attr;
