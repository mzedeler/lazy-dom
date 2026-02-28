"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const NodeTypes_1 = require("../../types/NodeTypes");
const Element_1 = require("../Element");
const NodeStore_1 = require("./NodeStore");
const ChildNodeList_1 = require("./ChildNodeList");
const nodeOps = __importStar(require("../../wasm/nodeOps"));
const NodeRegistry = __importStar(require("../../wasm/NodeRegistry"));
const DOMException_1 = require("../DOMException");
// Forward reference resolved at runtime to avoid circular imports
let DocumentFragment;
function getDocumentFragment() {
    if (!DocumentFragment) {
        DocumentFragment = require("../DocumentFragment").DocumentFragment;
    }
    return DocumentFragment;
}
class Node {
    wasmId;
    nodeStore;
    _childNodes;
    ELEMENT_NODE = NodeTypes_1.NodeTypes.ELEMENT_NODE;
    ATTRIBUTE_NODE = NodeTypes_1.NodeTypes.ATTRIBUTE_NODE;
    TEXT_NODE = NodeTypes_1.NodeTypes.TEXT_NODE;
    PROCESSING_INSTRUCTION_NODE = NodeTypes_1.NodeTypes.PROCESSING_INSTRUCTION_NODE;
    COMMENT_NODE = NodeTypes_1.NodeTypes.COMMENT_NODE;
    DOCUMENT_NODE = NodeTypes_1.NodeTypes.DOCUMENT_NODE;
    DOCUMENT_TYPE_NODE = NodeTypes_1.NodeTypes.DOCUMENT_TYPE_NODE;
    DOCUMENT_FRAGMENT_NODE = NodeTypes_1.NodeTypes.DOCUMENT_FRAGMENT_NODE;
    constructor(nodeType) {
        this.wasmId = nodeOps.createNode(nodeType);
        NodeRegistry.register(this.wasmId, this);
        this.nodeStore = new NodeStore_1.NodeStore(this.wasmId);
        this._childNodes = new ChildNodeList_1.ChildNodeList(this.nodeStore);
    }
    dump() {
        return this.nodeType + ':' + this.wasmId + ((this instanceof Element_1.Element) ? ':' + this.tagName : '');
    }
    get childNodes() {
        return this._childNodes;
    }
    get nodeType() {
        return nodeOps.getNodeType(this.wasmId);
    }
    get ownerDocument() {
        return this.nodeStore.ownerDocument();
    }
    get parent() {
        const parentId = nodeOps.getParentId(this.wasmId);
        if (parentId === 0)
            return null;
        return NodeRegistry.getNode(parentId) ?? null;
    }
    get parentNode() {
        return this.parent;
    }
    get parentElement() {
        const parent = this.parent;
        return parent instanceof Element_1.Element ? parent : null;
    }
    get firstChild() {
        return this.nodeStore.getChildNode(0) ?? null;
    }
    get lastChild() {
        const count = this.nodeStore.getChildCount();
        if (count === 0)
            return null;
        return this.nodeStore.getChildNode(count - 1) ?? null;
    }
    get nextSibling() {
        const parentId = nodeOps.getParentId(this.wasmId);
        if (parentId === 0)
            return null;
        const siblingIds = nodeOps.getChildIds(parentId);
        const myIndex = siblingIds.indexOf(this.wasmId);
        if (myIndex === -1 || myIndex === siblingIds.length - 1)
            return null;
        return NodeRegistry.getNode(siblingIds[myIndex + 1]) ?? null;
    }
    get previousSibling() {
        const parentId = nodeOps.getParentId(this.wasmId);
        if (parentId === 0)
            return null;
        const siblingIds = nodeOps.getChildIds(parentId);
        const myIndex = siblingIds.indexOf(this.wasmId);
        if (myIndex <= 0)
            return null;
        return NodeRegistry.getNode(siblingIds[myIndex - 1]) ?? null;
    }
    hasChildNodes() {
        return this.nodeStore.getChildCount() > 0;
    }
    get isConnected() {
        return this.parentNode !== null ? this.parentNode.isConnected : false;
    }
    get nodeValue() {
        return this.nodeStore.nodeValue();
    }
    set nodeValue(nodeValue) {
        this.nodeStore.nodeValue = () => nodeValue;
    }
    removeChild(node) {
        // Check that node is actually a child
        const childIds = nodeOps.getChildIds(this.wasmId);
        if (!childIds.includes(node.wasmId)) {
            throw new DOMException_1.DOMException("The node to be removed is not a child of this node.", 'NotFoundError', DOMException_1.DOMException.NOT_FOUND_ERR);
        }
        nodeOps.setParentId(node.wasmId, 0);
        nodeOps.removeChild(this.wasmId, node.wasmId);
        this.ownerDocument.documentStore.disconnect(node);
        return node;
    }
    insertBefore(newNode, referenceNode) {
        const DocFrag = getDocumentFragment();
        if (newNode instanceof DocFrag) {
            const children = newNode.nodeStore.getChildNodesArray();
            for (const child of children) {
                this.insertBefore(child, referenceNode);
            }
            return newNode;
        }
        // HIERARCHY_REQUEST_ERR: cannot insert an ancestor as a child
        if (newNode === this || newNode.contains(this)) {
            throw new DOMException_1.DOMException("The new child element contains the parent.", 'HierarchyRequestError', DOMException_1.DOMException.HIERARCHY_REQUEST_ERR);
        }
        // NOT_FOUND_ERR: referenceNode is not a child
        if (referenceNode !== null) {
            const childIds = nodeOps.getChildIds(this.wasmId);
            if (!childIds.includes(referenceNode.wasmId)) {
                throw new DOMException_1.DOMException("The node before which the new node is to be inserted is not a child of this node.", 'NotFoundError', DOMException_1.DOMException.NOT_FOUND_ERR);
            }
        }
        // Remove from old parent if needed
        const oldParentId = nodeOps.getParentId(newNode.wasmId);
        if (oldParentId !== 0) {
            nodeOps.removeChild(oldParentId, newNode.wasmId);
        }
        nodeOps.setParentId(newNode.wasmId, this.wasmId);
        nodeOps.insertBefore(this.wasmId, newNode.wasmId, referenceNode ? referenceNode.wasmId : 0);
        this.ownerDocument.documentStore.connect(newNode);
        return newNode;
    }
    appendChild(node) {
        const DocFrag = getDocumentFragment();
        if (node instanceof DocFrag) {
            const children = node.nodeStore.getChildNodesArray();
            for (const child of children) {
                this.appendChild(child);
            }
            return node;
        }
        // HIERARCHY_REQUEST_ERR: cannot insert an ancestor as a child
        if (node === this || node.contains(this)) {
            throw new DOMException_1.DOMException("The new child element contains the parent.", 'HierarchyRequestError', DOMException_1.DOMException.HIERARCHY_REQUEST_ERR);
        }
        // Remove from old parent if needed
        const oldParentId = nodeOps.getParentId(node.wasmId);
        if (oldParentId !== 0) {
            nodeOps.removeChild(oldParentId, node.wasmId);
        }
        nodeOps.setParentId(node.wasmId, this.wasmId);
        nodeOps.appendChild(this.wasmId, node.wasmId);
        this.ownerDocument.documentStore.connect(node);
        return node;
    }
    replaceChild(newChild, oldChild) {
        const DocFrag = getDocumentFragment();
        if (newChild instanceof DocFrag) {
            const children = newChild.nodeStore.getChildNodesArray();
            if (children.length === 0) {
                this.removeChild(oldChild);
                return oldChild;
            }
            // Insert fragment children before oldChild, then remove oldChild
            for (const child of children) {
                this.insertBefore(child, oldChild);
            }
            this.removeChild(oldChild);
            return oldChild;
        }
        this.insertBefore(newChild, oldChild);
        this.removeChild(oldChild);
        return oldChild;
    }
    cloneNode(deep = false) {
        const clone = this._cloneNodeShallow();
        if (deep) {
            const children = this.nodeStore.getChildNodesArray();
            for (const child of children) {
                clone.appendChild(child.cloneNode(true));
            }
        }
        return clone;
    }
    _cloneNodeShallow() {
        // Subclasses should override this for proper cloning
        throw new Error('_cloneNodeShallow not implemented for this node type');
    }
    normalize() {
        const children = this.nodeStore.getChildNodesArray();
        let i = 0;
        while (i < children.length) {
            const child = children[i];
            if (child.nodeType === NodeTypes_1.NodeTypes.TEXT_NODE) {
                const textChild = child;
                if (textChild.data === '') {
                    this.removeChild(child);
                    children.splice(i, 1);
                    continue;
                }
                // Merge consecutive text nodes
                while (i + 1 < children.length && children[i + 1].nodeType === NodeTypes_1.NodeTypes.TEXT_NODE) {
                    const nextText = children[i + 1];
                    textChild.data = textChild.data + nextText.data;
                    this.removeChild(children[i + 1]);
                    children.splice(i + 1, 1);
                }
            }
            else if (child.nodeType === NodeTypes_1.NodeTypes.ELEMENT_NODE) {
                child.normalize();
            }
            i++;
        }
    }
    contains(other) {
        if (!other)
            return false;
        let current = other;
        while (current) {
            if (current === this)
                return true;
            current = current.parent;
        }
        return false;
    }
    remove() {
        const parent = this.parent;
        if (parent) {
            parent.removeChild(this);
        }
    }
    getRootNode() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let current = this;
        while (current.parent !== null) {
            current = current.parent;
        }
        // If the root is the documentElement, return the document itself
        const doc = current.ownerDocument;
        if (doc.documentElement === current) {
            return doc;
        }
        return current;
    }
}
exports.Node = Node;
