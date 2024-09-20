"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTypes = void 0;
var NodeTypes;
(function (NodeTypes) {
    NodeTypes[NodeTypes["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    NodeTypes[NodeTypes["TEXT_NODE"] = 3] = "TEXT_NODE";
    NodeTypes[NodeTypes["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    NodeTypes[NodeTypes["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
    NodeTypes[NodeTypes["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
})(NodeTypes || (exports.NodeTypes = NodeTypes = {}));
