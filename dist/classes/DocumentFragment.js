"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentFragment = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
const Node_1 = require("./Node/Node");
class DocumentFragment extends Node_1.Node {
    nodeName = '#document-fragment';
    constructor() {
        super(NodeTypes_1.NodeTypes.DOCUMENT_FRAGMENT_NODE);
    }
    get nodeValue() {
        return null;
    }
    set nodeValue(_value) {
        // Setting nodeValue on DocumentFragment has no effect per spec
    }
    get textContent() {
        return this.nodeStore.getChildNodesArray()
            .map(child => {
            if ('textContent' in child)
                return child.textContent;
            if ('data' in child)
                return child.data;
            return '';
        })
            .join('');
    }
    _cloneNodeShallow() {
        const clone = this.ownerDocument.createDocumentFragment();
        return clone;
    }
}
exports.DocumentFragment = DocumentFragment;
