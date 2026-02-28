"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCssNode = isCssNode;
exports.isCssElement = isCssElement;
const NodeTypes_1 = require("./NodeTypes");
/** Type guard: checks if a value is a CssNode (has nodeType property). */
function isCssNode(value) {
    return value !== null && typeof value === 'object' && 'nodeType' in value
        && typeof value.nodeType === 'number';
}
/** Type guard: checks if a CssNode is a CssElement (element node type). */
function isCssElement(node) {
    return node.nodeType === NodeTypes_1.NodeTypes.ELEMENT_NODE;
}
