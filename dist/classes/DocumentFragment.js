"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentFragment = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
const Node_1 = require("./Node/Node");
const Element_1 = require("./Element");
const CharacterData_1 = require("./CharacterData");
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
            if (child instanceof Element_1.Element)
                return child.textContent;
            if (child instanceof CharacterData_1.CharacterData)
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
