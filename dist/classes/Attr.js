"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attr = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
class Attr {
    constructor(ownerElement, localName, value, namespaceURI = null, prefix = null) {
        this.ownerElement = ownerElement;
        this.localName = localName;
        this.value = value;
        this.namespaceURI = namespaceURI;
        this.prefix = prefix;
    }
    ownerElement;
    localName;
    value;
    namespaceURI;
    prefix;
    specified = true;
    nodeType = NodeTypes_1.NodeTypes.ATTRIBUTE_NODE;
    parentNode = null;
    nextSibling = null;
    previousSibling = null;
    childNodes = [];
    attributes = null;
    get name() {
        if (this.prefix) {
            return this.prefix + ':' + this.localName;
        }
        return this.localName;
    }
    get nodeName() {
        return this.name;
    }
    get nodeValue() {
        return this.value;
    }
    set nodeValue(val) {
        this.value = val;
    }
}
exports.Attr = Attr;
