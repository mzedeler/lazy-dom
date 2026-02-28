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
exports.Document = exports.DocumentStore = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
const valueNotSetError_1 = __importDefault(require("../utils/valueNotSetError"));
const Element_1 = require("./Element");
const HTMLBodyElement_1 = require("./elements/HTMLBodyElement");
const Text_1 = require("./Text");
const Comment_1 = require("./Comment");
const DocumentFragment_1 = require("./DocumentFragment");
const ProcessingInstruction_1 = require("./ProcessingInstruction");
const Attr_1 = require("./Attr");
const HTMLDivElement_1 = require("./elements/HTMLDivElement");
const HTMLImageElement_1 = require("./elements/HTMLImageElement");
const HTMLHeadingElement_1 = require("./elements/HTMLHeadingElement");
const HTMLLabelElement_1 = require("./elements/HTMLLabelElement");
const HTMLInputElement_1 = require("./elements/HTMLInputElement");
const HTMLButtonElement_1 = require("./elements/HTMLButtonElement");
const HTMLFormElement_1 = require("./elements/HTMLFormElement");
const HTMLSpanElement_1 = require("./elements/HTMLSpanElement");
const HTMLUListElement_1 = require("./elements/HTMLUListElement");
const HTMLAnchorElement_1 = require("./elements/HTMLAnchorElement");
const HTMLPreElement_1 = require("./elements/HTMLPreElement");
const HTMLParagraphElement_1 = require("./elements/HTMLParagraphElement");
const HTMLElement_1 = require("./elements/HTMLElement");
const SVGPathElement_1 = require("./elements/SVGPathElement");
const SVGElement_1 = require("./elements/SVGElement");
const HTMLLIElement_1 = require("./elements/HTMLLIElement");
const HTMLAreaElement_1 = require("./elements/HTMLAreaElement");
const HTMLBRElement_1 = require("./elements/HTMLBRElement");
const HTMLBaseElement_1 = require("./elements/HTMLBaseElement");
const HTMLDListElement_1 = require("./elements/HTMLDListElement");
const HTMLFieldSetElement_1 = require("./elements/HTMLFieldSetElement");
const HTMLHRElement_1 = require("./elements/HTMLHRElement");
const HTMLHtmlElement_1 = require("./elements/HTMLHtmlElement");
const HTMLIFrameElement_1 = require("./elements/HTMLIFrameElement");
const HTMLLegendElement_1 = require("./elements/HTMLLegendElement");
const HTMLLinkElement_1 = require("./elements/HTMLLinkElement");
const HTMLMapElement_1 = require("./elements/HTMLMapElement");
const HTMLMetaElement_1 = require("./elements/HTMLMetaElement");
const HTMLModElement_1 = require("./elements/HTMLModElement");
const HTMLOListElement_1 = require("./elements/HTMLOListElement");
const HTMLObjectElement_1 = require("./elements/HTMLObjectElement");
const HTMLOptGroupElement_1 = require("./elements/HTMLOptGroupElement");
const HTMLOptionElement_1 = require("./elements/HTMLOptionElement");
const HTMLParamElement_1 = require("./elements/HTMLParamElement");
const HTMLQuoteElement_1 = require("./elements/HTMLQuoteElement");
const HTMLScriptElement_1 = require("./elements/HTMLScriptElement");
const HTMLSelectElement_1 = require("./elements/HTMLSelectElement");
const HTMLStyleElement_1 = require("./elements/HTMLStyleElement");
const HTMLTableElement_1 = require("./elements/HTMLTableElement");
const HTMLTableCaptionElement_1 = require("./elements/HTMLTableCaptionElement");
const HTMLTableCellElement_1 = require("./elements/HTMLTableCellElement");
const HTMLTableColElement_1 = require("./elements/HTMLTableColElement");
const HTMLTableRowElement_1 = require("./elements/HTMLTableRowElement");
const HTMLTableSectionElement_1 = require("./elements/HTMLTableSectionElement");
const HTMLTextAreaElement_1 = require("./elements/HTMLTextAreaElement");
const HTMLTitleElement_1 = require("./elements/HTMLTitleElement");
const HTMLCollection_1 = require("./HTMLCollection");
const DOMImplementation_1 = require("./DOMImplementation");
const DOMException_1 = require("./DOMException");
const nodeOps = __importStar(require("../wasm/nodeOps"));
const NodeRegistry = __importStar(require("../wasm/NodeRegistry"));
class DocumentStore {
    wasmDocId;
    documentElement = () => {
        throw (0, valueNotSetError_1.default)('documentElement');
    };
    body = () => {
        throw (0, valueNotSetError_1.default)('body');
    };
    head = () => {
        throw (0, valueNotSetError_1.default)('head');
    };
    constructor() {
        this.wasmDocId = nodeOps.createDocument();
    }
    disconnect(node) {
        nodeOps.disconnectSubtree(this.wasmDocId, node.wasmId);
    }
    connect(node) {
        nodeOps.connectSubtree(this.wasmDocId, node.wasmId);
    }
    get elements() {
        const ids = nodeOps.getConnectedElementIds(this.wasmDocId);
        const result = [];
        for (let i = 0; i < ids.length; i++) {
            const node = NodeRegistry.getNode(ids[i]);
            if (node instanceof Element_1.Element) {
                result.push(node);
            }
        }
        return result;
    }
}
exports.DocumentStore = DocumentStore;
const constructors = {
    'http://www.w3.org/1999/xhtml': {
        A: HTMLAnchorElement_1.HTMLAnchorElement,
        BUTTON: HTMLButtonElement_1.HTMLButtonElement,
        FORM: HTMLFormElement_1.HTMLFormElement,
        H1: HTMLHeadingElement_1.HTMLHeadingElement,
        H2: HTMLHeadingElement_1.HTMLHeadingElement,
        H3: HTMLHeadingElement_1.HTMLHeadingElement,
        H4: HTMLHeadingElement_1.HTMLHeadingElement,
        H5: HTMLHeadingElement_1.HTMLHeadingElement,
        H6: HTMLHeadingElement_1.HTMLHeadingElement,
        LABEL: HTMLLabelElement_1.HTMLLabelElement,
        DIV: HTMLDivElement_1.HTMLDivElement,
        IMG: HTMLImageElement_1.HTMLImageElement,
        INPUT: HTMLInputElement_1.HTMLInputElement,
        LI: HTMLLIElement_1.HTMLLIElement,
        SPAN: HTMLSpanElement_1.HTMLSpanElement,
        UL: HTMLUListElement_1.HTMLUListElement,
        PRE: HTMLPreElement_1.HTMLPreElement,
        P: HTMLParagraphElement_1.HTMLParagraphElement,
        CODE: HTMLElement_1.HTMLElement,
        AREA: HTMLAreaElement_1.HTMLAreaElement,
        BR: HTMLBRElement_1.HTMLBRElement,
        BASE: HTMLBaseElement_1.HTMLBaseElement,
        DL: HTMLDListElement_1.HTMLDListElement,
        FIELDSET: HTMLFieldSetElement_1.HTMLFieldSetElement,
        HR: HTMLHRElement_1.HTMLHRElement,
        HTML: HTMLHtmlElement_1.HTMLHtmlElement,
        IFRAME: HTMLIFrameElement_1.HTMLIFrameElement,
        LEGEND: HTMLLegendElement_1.HTMLLegendElement,
        LINK: HTMLLinkElement_1.HTMLLinkElement,
        MAP: HTMLMapElement_1.HTMLMapElement,
        META: HTMLMetaElement_1.HTMLMetaElement,
        INS: HTMLModElement_1.HTMLModElement,
        DEL: HTMLModElement_1.HTMLModElement,
        OL: HTMLOListElement_1.HTMLOListElement,
        OBJECT: HTMLObjectElement_1.HTMLObjectElement,
        OPTGROUP: HTMLOptGroupElement_1.HTMLOptGroupElement,
        OPTION: HTMLOptionElement_1.HTMLOptionElement,
        PARAM: HTMLParamElement_1.HTMLParamElement,
        BLOCKQUOTE: HTMLQuoteElement_1.HTMLQuoteElement,
        Q: HTMLQuoteElement_1.HTMLQuoteElement,
        SCRIPT: HTMLScriptElement_1.HTMLScriptElement,
        SELECT: HTMLSelectElement_1.HTMLSelectElement,
        STYLE: HTMLStyleElement_1.HTMLStyleElement,
        TABLE: HTMLTableElement_1.HTMLTableElement,
        CAPTION: HTMLTableCaptionElement_1.HTMLTableCaptionElement,
        TD: HTMLTableCellElement_1.HTMLTableCellElement,
        TH: HTMLTableCellElement_1.HTMLTableCellElement,
        COL: HTMLTableColElement_1.HTMLTableColElement,
        COLGROUP: HTMLTableColElement_1.HTMLTableColElement,
        TR: HTMLTableRowElement_1.HTMLTableRowElement,
        THEAD: HTMLTableSectionElement_1.HTMLTableSectionElement,
        TBODY: HTMLTableSectionElement_1.HTMLTableSectionElement,
        TFOOT: HTMLTableSectionElement_1.HTMLTableSectionElement,
        TEXTAREA: HTMLTextAreaElement_1.HTMLTextAreaElement,
        TITLE: HTMLTitleElement_1.HTMLTitleElement,
        CANVAS: HTMLElement_1.HTMLElement,
        BODY: HTMLBodyElement_1.HTMLBodyElement,
        HEAD: HTMLElement_1.HTMLElement,
    },
    'http://www.w3.org/2000/svg': {
        PATH: SVGPathElement_1.SVGPathElement,
        SVG: SVGElement_1.SVGElement,
    }
};
class Document {
    documentStore = new DocumentStore();
    defaultView = null;
    implementation = new DOMImplementation_1.DOMImplementation();
    debug() {
        return this.documentStore.elements;
    }
    constructor() {
        // Lazy init: the entire html > head + body tree is built on first access
        const initTree = () => {
            const html = new HTMLHtmlElement_1.HTMLHtmlElement();
            html.elementStore.tagName = () => 'HTML';
            html.nodeStore.ownerDocument = () => this;
            const head = new HTMLElement_1.HTMLElement();
            head.elementStore.tagName = () => 'HEAD';
            head.nodeStore.ownerDocument = () => this;
            const body = new HTMLBodyElement_1.HTMLBodyElement();
            body.nodeStore.ownerDocument = () => this;
            // Build tree: html > head + body
            nodeOps.setParentId(head.wasmId, html.wasmId);
            nodeOps.appendChild(html.wasmId, head.wasmId);
            nodeOps.setParentId(body.wasmId, html.wasmId);
            nodeOps.appendChild(html.wasmId, body.wasmId);
            // Connect entire tree to document for element tracking
            this.documentStore.connect(html);
            // Memoize all three
            this.documentStore.documentElement = () => html;
            this.documentStore.body = () => body;
            this.documentStore.head = () => head;
            return { html, head, body };
        };
        // Any of the three accessors triggers full tree init
        this.documentStore.documentElement = () => {
            const { html } = initTree();
            return html;
        };
        this.documentStore.body = () => {
            const { body } = initTree();
            return body;
        };
        this.documentStore.head = () => {
            const { head } = initTree();
            return head;
        };
        Object.assign(this, NodeTypes_1.NodeTypes);
    }
    get all() {
        return this.documentStore.elements.filter(x => x.parent);
    }
    get body() {
        return this.documentStore.body();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createElementNS(namespaceURI, qualifiedName, options) {
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
        const constructor = (namespaceURI ? constructors[namespaceURI]?.[localName.toUpperCase()] : null) ?? HTMLElement_1.HTMLElement;
        const element = new constructor();
        element.elementStore.tagName = () => qualifiedName;
        element.elementStore.namespaceURI = () => namespaceURI;
        element.nodeStore.ownerDocument = () => this;
        return element;
    }
    createElement(localName) {
        const constructor = constructors['http://www.w3.org/1999/xhtml'][localName.toUpperCase()] ?? HTMLElement_1.HTMLElement;
        const element = new constructor();
        element.elementStore.tagName = () => localName;
        element.nodeStore.ownerDocument = () => this;
        return element;
    }
    _disconnect(node) {
        if (node instanceof Element_1.Element) {
            nodeOps.disconnectElement(this.documentStore.wasmDocId, node.wasmId);
        }
    }
    createTextNode(data) {
        const textNode = new Text_1.Text();
        textNode.nodeStore.ownerDocument = () => this;
        textNode.textStore.data = () => data;
        return textNode;
    }
    createComment(data) {
        const comment = new Comment_1.Comment(data);
        comment.nodeStore.ownerDocument = () => this;
        return comment;
    }
    createDocumentFragment() {
        const fragment = new DocumentFragment_1.DocumentFragment();
        fragment.nodeStore.ownerDocument = () => this;
        return fragment;
    }
    createProcessingInstruction(target, data) {
        const pi = new ProcessingInstruction_1.ProcessingInstruction(target, data);
        pi.nodeStore.ownerDocument = () => this;
        return pi;
    }
    createAttribute(localName) {
        return new Attr_1.Attr(null, localName, '');
    }
    createAttributeNS(namespaceURI, qualifiedName) {
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
        return new Attr_1.Attr(null, localName, '', namespaceURI, prefix);
    }
    importNode(importedNode, deep = false) {
        const clone = importedNode.cloneNode(deep);
        this._setOwnerDocument(clone);
        return clone;
    }
    _setOwnerDocument(node) {
        node.nodeStore.ownerDocument = () => this;
        const children = node.nodeStore.getChildNodesArray();
        for (const child of children) {
            this._setOwnerDocument(child);
        }
    }
    getElementsByTagName(tagName) {
        return this.documentElement.getElementsByTagName(tagName);
    }
    getElementById(id) {
        const elementMatchingId = (element) => element.getAttribute('id') === id;
        return this
            .documentStore
            .elements
            .find(elementMatchingId) || null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatchEvent(event) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addEventListener(type, listener) {
    }
    removeEventListener() {
    }
    querySelectorAll(query) {
        return this.documentElement.querySelectorAll(query);
    }
    querySelector(selectors) {
        return this.documentElement.querySelector(selectors);
    }
    getElementsByTagNameNS(namespaceURI, localName) {
        const filter = (element) => {
            return element.tagName.toUpperCase() === localName.toUpperCase() && element.namespaceURI === namespaceURI;
        };
        const documentStore = this.documentStore;
        class ByTagNameNSCollection extends HTMLCollection_1.HTMLCollection {
            filter;
            constructor(filter) {
                super();
                this.filter = filter;
            }
            item(index) {
                return documentStore
                    .elements
                    .filter(filter)
                    .at(index) || null;
            }
            get length() {
                return documentStore
                    .elements
                    .filter(filter)
                    .length;
            }
            namedItem(key) {
                return documentStore
                    .elements
                    .filter(filter)
                    .find(element => element.getAttribute('name') === key || element.getAttribute('id') === key) || null;
            }
        }
        return new ByTagNameNSCollection(filter);
    }
    get nodeType() {
        return NodeTypes_1.NodeTypes.DOCUMENT_NODE;
    }
    get nodeName() {
        return '#document';
    }
    get nodeValue() {
        return null;
    }
    set nodeValue(_value) {
        // Setting nodeValue on Document has no effect per spec
    }
    get attributes() {
        return null;
    }
    get location() {
        return this.defaultView.location;
    }
    get referrer() {
        return '';
    }
    get head() {
        return this.documentStore.head();
    }
    get documentElement() {
        return this.documentStore.documentElement();
    }
}
exports.Document = Document;
