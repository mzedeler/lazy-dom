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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
const valueNotSetError_1 = __importDefault(require("../utils/valueNotSetError"));
const Text_1 = require("./Text");
const Node_1 = require("./Node/Node");
const PointerEvent_1 = require("./PointerEvent");
const Attr_1 = require("./Attr");
const NamedNodeMap_1 = require("./NamedNodeMap");
const CssSelectAdapter_1 = require("../utils/CssSelectAdapter");
const CSSselect = __importStar(require("css-select"));
const nodeOps = __importStar(require("../wasm/nodeOps"));
const NodeRegistry = __importStar(require("../wasm/NodeRegistry"));
const DOMTokenList_1 = require("./DOMTokenList");
const DOMStringMap_1 = require("./DOMStringMap");
const DOMException_1 = require("./DOMException");
const adapter = new CssSelectAdapter_1.CssSelectAdapter();
class ElementStore {
    eventListeners = () => ({});
    tagName = () => {
        throw (0, valueNotSetError_1.default)('tagName');
    };
    style = () => ({});
    attributes = () => new NamedNodeMap_1.NamedNodeMap();
    namespaceURI = () => null;
}
const isEventTarget = (node) => Boolean(node && node.addEventListener && node.dispatchEvent);
class Element extends Node_1.Node {
    elementStore = new ElementStore();
    constructor() {
        super(NodeTypes_1.NodeTypes.ELEMENT_NODE);
    }
    get ownerDocument() {
        return this.nodeStore.ownerDocument();
    }
    get tagName() {
        return this.elementStore.tagName().toUpperCase();
    }
    get nodeName() {
        return this.tagName;
    }
    get namespaceURI() {
        return this.elementStore.namespaceURI();
    }
    set namespaceURI(namespaceURI) {
        this.elementStore.namespaceURI = () => namespaceURI;
    }
    get innerHTML() {
        return this.nodeStore.getChildNodesArray()
            .map((node) => {
            if (node instanceof Element)
                return node.outerHTML;
            if (node instanceof Text_1.Text)
                return node.data;
            return '';
        })
            .join('');
    }
    set innerHTML(html) {
        // Clear all existing children
        nodeOps.clearChildren(this.wasmId);
        // If non-empty, set as text content (no HTML parsing)
        if (html.length) {
            const ownerDocument = this.nodeStore.ownerDocument();
            const textNode = ownerDocument.createTextNode(html);
            nodeOps.setParentId(textNode.wasmId, this.wasmId);
            nodeOps.appendChild(this.wasmId, textNode.wasmId);
        }
    }
    get outerHTML() {
        const attributes = Object
            .values(this.elementStore.attributes().namedNodeMapStore.itemsLookup())
            .map((attr) => ' ' + attr.localName + '="' + attr.value + '"')
            .join('');
        return '<' + this.tagName.toLocaleLowerCase() + attributes + '>'
            + this.innerHTML
            + '</' + this.tagName.toLocaleLowerCase() + '>';
    }
    get style() {
        return this.elementStore.style();
    }
    get nodeValue() {
        return null;
    }
    set nodeValue(_value) {
        // Setting nodeValue on an Element has no effect per spec
    }
    get textContent() {
        const children = this.nodeStore.getChildNodesArray();
        const fragments = [];
        for (const value of children) {
            if (value instanceof Text_1.Text) {
                fragments.push(value.nodeValue);
            }
        }
        return fragments.join('');
    }
    set textContent(data) {
        // Clear all existing children from WASM
        nodeOps.clearChildren(this.wasmId);
        if (data.length) {
            const ownerDocument = this.nodeStore.ownerDocument();
            const textNode = ownerDocument.createTextNode(data);
            nodeOps.setParentId(textNode.wasmId, this.wasmId);
            nodeOps.appendChild(this.wasmId, textNode.wasmId);
        }
    }
    get attributes() {
        const result = this.elementStore.attributes();
        this.elementStore.attributes = () => result;
        return result;
    }
    setAttribute(localName, value) {
        const previousAttributesFuture = this.elementStore.attributes;
        this.elementStore.attributes = () => {
            const previousAttributes = previousAttributesFuture();
            const attr = new Attr_1.Attr(this, localName, value);
            previousAttributes.setNamedItem(attr);
            return previousAttributes;
        };
        return;
    }
    removeAttribute(qualifiedName) {
        const previousAttributesFuture = this.elementStore.attributes;
        this.elementStore.attributes = () => {
            const previousAttributes = previousAttributesFuture();
            previousAttributes.removeNamedItem(qualifiedName);
            return previousAttributes;
        };
    }
    get addEventListener() {
        return (type, listener) => {
            if (!listener) {
                return;
            }
            const previousEventListenersFuture = this.elementStore.eventListeners;
            this.elementStore.eventListeners = () => {
                const previousEventListeners = previousEventListenersFuture();
                let queue = previousEventListeners[type];
                if (!queue) {
                    queue = [];
                }
                queue.push(listener);
                previousEventListeners[type] = queue;
                return previousEventListeners;
            };
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeEventListener(type, listener) {
        // Stub: event listener removal not fully implemented
    }
    dispatchEvent(event) {
        const listeners = this.elementStore.eventListeners();
        const queue = listeners[event.type];
        if (queue && queue.length) {
            queue.forEach(listener => listener(event));
        }
        else {
            const parentId = nodeOps.getParentId(this.wasmId);
            const parent = parentId ? NodeRegistry.getNode(parentId) : undefined;
            if (isEventTarget(parent)) {
                parent.dispatchEvent(event);
            }
        }
    }
    click() {
        const event = new PointerEvent_1.PointerEvent();
        event.eventStore.type = () => 'click';
        event.eventStore.target = () => this;
        this.dispatchEvent(event);
    }
    get hidden() {
        return this.hasAttribute('hidden');
    }
    hasAttribute(name) {
        return this.attributes.getNamedItem(name) !== null;
    }
    getAttributeNames() {
        return Object.keys(this.attributes.namedNodeMapStore.itemsLookup());
    }
    getAttribute(qualifiedName) {
        return this.attributes.getNamedItem(qualifiedName)?.value ?? null;
    }
    getAttributeNode(qualifiedName) {
        return this.attributes.getNamedItem(qualifiedName) ?? null;
    }
    setAttributeNode(attr) {
        // INUSE_ATTRIBUTE_ERR: attr is already owned by a different element
        if (attr.ownerElement !== null && attr.ownerElement !== this) {
            throw new DOMException_1.DOMException("The attribute is already in use by another element.", 'InUseAttributeError', DOMException_1.DOMException.INUSE_ATTRIBUTE_ERR);
        }
        const previousAttributesFuture = this.elementStore.attributes;
        let oldAttr = null;
        this.elementStore.attributes = () => {
            const previousAttributes = previousAttributesFuture();
            oldAttr = previousAttributes.setNamedItem(attr);
            attr.ownerElement = this;
            return previousAttributes;
        };
        // Force evaluation to get the old attr
        this.elementStore.attributes();
        return oldAttr;
    }
    removeAttributeNode(attr) {
        const current = this.attributes.getNamedItem(attr.name);
        if (current !== attr) {
            throw new DOMException_1.DOMException("The attribute is not found on this element.", 'NotFoundError', DOMException_1.DOMException.NOT_FOUND_ERR);
        }
        this.removeAttribute(attr.name);
        attr.ownerElement = null;
        return attr;
    }
    hasAttributes() {
        return this.attributes.length > 0;
    }
    get localName() {
        const tagName = this.elementStore.tagName();
        const colonIndex = tagName.indexOf(':');
        if (colonIndex >= 0) {
            return tagName.substring(colonIndex + 1);
        }
        return tagName;
    }
    get prefix() {
        const tagName = this.elementStore.tagName();
        const colonIndex = tagName.indexOf(':');
        if (colonIndex >= 0) {
            return tagName.substring(0, colonIndex);
        }
        return null;
    }
    setAttributeNS(namespaceURI, qualifiedName, value) {
        // Parse prefix:localName
        let prefix = null;
        let localName = qualifiedName;
        const colonIndex = qualifiedName.indexOf(':');
        if (colonIndex >= 0) {
            prefix = qualifiedName.substring(0, colonIndex);
            localName = qualifiedName.substring(colonIndex + 1);
        }
        // NAMESPACE_ERR checks
        if (prefix !== null && namespaceURI === null) {
            throw new DOMException_1.DOMException("Namespace is null but prefix is not null.", 'NamespaceError', DOMException_1.DOMException.NAMESPACE_ERR);
        }
        if (prefix === 'xml' && namespaceURI !== 'http://www.w3.org/XML/1998/namespace') {
            throw new DOMException_1.DOMException("Prefix 'xml' requires namespace 'http://www.w3.org/XML/1998/namespace'.", 'NamespaceError', DOMException_1.DOMException.NAMESPACE_ERR);
        }
        if (qualifiedName === 'xmlns' && namespaceURI !== 'http://www.w3.org/2000/xmlns/') {
            throw new DOMException_1.DOMException("'xmlns' requires namespace 'http://www.w3.org/2000/xmlns/'.", 'NamespaceError', DOMException_1.DOMException.NAMESPACE_ERR);
        }
        if (prefix === 'xmlns' && namespaceURI !== 'http://www.w3.org/2000/xmlns/') {
            throw new DOMException_1.DOMException("Prefix 'xmlns' requires namespace 'http://www.w3.org/2000/xmlns/'.", 'NamespaceError', DOMException_1.DOMException.NAMESPACE_ERR);
        }
        const attr = new Attr_1.Attr(this, localName, value, namespaceURI, prefix);
        const previousAttributesFuture = this.elementStore.attributes;
        this.elementStore.attributes = () => {
            const previousAttributes = previousAttributesFuture();
            previousAttributes.setNamedItemNS(attr);
            return previousAttributes;
        };
    }
    getAttributeNS(namespaceURI, localName) {
        const attr = this.attributes.getNamedItemNS(namespaceURI, localName);
        return attr ? attr.value : null;
    }
    getAttributeNodeNS(namespaceURI, localName) {
        return this.attributes.getNamedItemNS(namespaceURI, localName);
    }
    removeAttributeNS(namespaceURI, localName) {
        const previousAttributesFuture = this.elementStore.attributes;
        this.elementStore.attributes = () => {
            const previousAttributes = previousAttributesFuture();
            previousAttributes.removeNamedItemNS(namespaceURI, localName);
            return previousAttributes;
        };
    }
    hasAttributeNS(namespaceURI, localName) {
        return this.attributes.getNamedItemNS(namespaceURI, localName) !== null;
    }
    setAttributeNodeNS(attr) {
        if (attr.ownerElement !== null && attr.ownerElement !== this) {
            throw new DOMException_1.DOMException("The attribute is already in use by another element.", 'InUseAttributeError', DOMException_1.DOMException.INUSE_ATTRIBUTE_ERR);
        }
        const previousAttributesFuture = this.elementStore.attributes;
        let oldAttr = null;
        this.elementStore.attributes = () => {
            const previousAttributes = previousAttributesFuture();
            oldAttr = previousAttributes.setNamedItemNS(attr);
            attr.ownerElement = this;
            return previousAttributes;
        };
        this.elementStore.attributes();
        return oldAttr;
    }
    getElementsByTagNameNS(namespaceURI, localName) {
        const matchAllNS = namespaceURI === '*';
        const matchAllName = localName === '*';
        const results = [];
        const walk = (node) => {
            const children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child instanceof Element) {
                    const nsMatch = matchAllNS || child.namespaceURI === namespaceURI;
                    const nameMatch = matchAllName || child.localName === localName;
                    if (nsMatch && nameMatch) {
                        results.push(child);
                    }
                    walk(child);
                }
            }
        };
        walk(this);
        return results;
    }
    getElementsByTagName(tagName) {
        const upperName = tagName.toUpperCase();
        const matchAll = tagName === '*';
        const results = [];
        const walk = (node) => {
            const children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child instanceof Element) {
                    if (matchAll || child.tagName === upperName) {
                        results.push(child);
                    }
                    walk(child);
                }
            }
        };
        walk(this);
        return results;
    }
    querySelectorAll(query) {
        return CSSselect.selectAll(query, this, { adapter }).filter((node) => node instanceof Element);
    }
    matches(selectors) {
        return CSSselect.is(this, selectors, { adapter });
    }
    querySelector(selectors) {
        const result = CSSselect.selectOne(selectors, this, { adapter });
        return result instanceof Element ? result : null;
    }
    append(...nodes) {
        for (const node of nodes) {
            if (typeof node === 'string') {
                this.appendChild(this.ownerDocument.createTextNode(node));
            }
            else {
                this.appendChild(node);
            }
        }
    }
    prepend(...nodes) {
        const firstChild = this.firstChild;
        for (const node of nodes) {
            const child = typeof node === 'string'
                ? this.ownerDocument.createTextNode(node)
                : node;
            this.insertBefore(child, firstChild);
        }
    }
    after(...nodes) {
        const parent = this.parentNode;
        if (!parent)
            return;
        const nextSib = this.nextSibling;
        for (const node of nodes) {
            const child = typeof node === 'string'
                ? this.ownerDocument.createTextNode(node)
                : node;
            parent.insertBefore(child, nextSib);
        }
    }
    before(...nodes) {
        const parent = this.parentNode;
        if (!parent)
            return;
        for (const node of nodes) {
            const child = typeof node === 'string'
                ? this.ownerDocument.createTextNode(node)
                : node;
            parent.insertBefore(child, this);
        }
    }
    replaceWith(...nodes) {
        const parent = this.parentNode;
        if (!parent)
            return;
        const nextSib = this.nextSibling;
        parent.removeChild(this);
        for (const node of nodes) {
            const child = typeof node === 'string'
                ? this.ownerDocument.createTextNode(node)
                : node;
            parent.insertBefore(child, nextSib);
        }
    }
    getBoundingClientRect() {
        return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, x: 0, y: 0, toJSON() { return {}; } };
    }
    getClientRects() {
        return [];
    }
    focus() { }
    blur() { }
    closest(selectors) {
        let current = this;
        while (current) {
            if (current.matches(selectors))
                return current;
            current = current.parentElement;
        }
        return null;
    }
    get classList() {
        return new DOMTokenList_1.DOMTokenList(this.elementStore);
    }
    get dataset() {
        return new DOMStringMap_1.DOMStringMap(this.elementStore);
    }
    get children() {
        return this.nodeStore.getChildNodesArray().filter(node => node instanceof Element);
    }
    _cloneNodeShallow() {
        const tagName = this.elementStore.tagName();
        const ns = this.elementStore.namespaceURI();
        const clone = ns
            ? this.ownerDocument.createElementNS(ns, tagName)
            : this.ownerDocument.createElement(tagName);
        // Copy attributes preserving namespace info
        for (const attr of this.attributes) {
            if (attr.namespaceURI) {
                clone.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
            }
            else {
                clone.setAttribute(attr.name, attr.value);
            }
        }
        return clone;
    }
}
exports.Element = Element;
