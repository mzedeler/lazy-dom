"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
var NodeTypes_1 = require("../types/NodeTypes");
var valueNotSetError_1 = require("../utils/valueNotSetError");
var Element_1 = require("./Element");
var HTMLBodyElement_1 = require("./elements/HTMLBodyElement");
var Text_1 = require("./Text");
var HTMLDivElement_1 = require("./elements/HTMLDivElement");
var HTMLImageElement_1 = require("./elements/HTMLImageElement");
var HTMLHeadingElement_1 = require("./elements/HTMLHeadingElement");
var HTMLLabelElement_1 = require("./elements/HTMLLabelElement");
var HTMLInputElement_1 = require("./elements/HTMLInputElement");
var HTMLButtonElement_1 = require("./elements/HTMLButtonElement");
var HTMLFormElement_1 = require("./elements/HTMLFormElement");
var HTMLSpanElement_1 = require("./elements/HTMLSpanElement");
var HTMLUListElement_1 = require("./elements/HTMLUListElement");
var HTMLAnchorElement_1 = require("./elements/HTMLAnchorElement");
var HTMLPreElement_1 = require("./elements/HTMLPreElement");
var HTMLParagraphElement_1 = require("./elements/HTMLParagraphElement");
var HTMLElement_1 = require("./elements/HTMLElement");
var SVGPathElement_1 = require("./elements/SVGPathElement");
var SVGElement_1 = require("./elements/SVGElement");
var HTMLLIElement_1 = require("./elements/HTMLLIElement");
var subtree = function (node) {
    var stack = [node];
    var result = new Set();
    do {
        var nextNode = stack.shift();
        if (nextNode) {
            result.add(nextNode);
            if (nextNode instanceof Element_1.Element) {
                stack.push.apply(stack, nextNode.childNodes);
            }
        }
    } while (stack.length);
    return result;
};
var DocumentStore = /** @class */ (function () {
    function DocumentStore() {
        this.elements = function () { return []; };
        this.nodeType = function () { return NodeTypes_1.NodeTypes.DOCUMENT_NODE; };
        this.body = function () {
            throw (0, valueNotSetError_1.default)('body');
        };
    }
    DocumentStore.prototype.disconnect = function (node) {
        var elementsFuture = this.elements;
        this.elements = function () {
            var remove = subtree(node);
            return elementsFuture().filter(function (otherNode) { return !remove.has(otherNode); });
        };
    };
    DocumentStore.prototype.connect = function (node) {
        var elementsFuture = this.elements;
        this.elements = function () {
            var newNodes = subtree(node);
            var result = new Set(elementsFuture ? elementsFuture() : []);
            newNodes.forEach(function (node) {
                if (node instanceof Element_1.Element) {
                    result.add(node);
                }
            });
            return Array.from(result);
        };
    };
    return DocumentStore;
}());
var Document = /** @class */ (function () {
    function Document() {
        var _this = this;
        this.documentStore = new DocumentStore();
        this.documentStore.body = function () {
            var body = new HTMLBodyElement_1.HTMLBodyElement();
            _this.documentStore.body = function () { return body; };
            body.nodeStore.ownerDocument = function () { return _this; };
            return body;
        };
        Object.assign(this, NodeTypes_1.NodeTypes);
    }
    Document.prototype.debug = function () {
        return this.documentStore.elements();
    };
    Object.defineProperty(Document.prototype, "all", {
        get: function () {
            return this.documentStore.elements().filter(function (x) { return x.parent; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "body", {
        get: function () {
            return this.documentStore.body();
        },
        enumerable: false,
        configurable: true
    });
    Document.prototype.createElementNS = function (namespaceURI, qualifiedName, options) {
        var _this = this;
        var element;
        switch (namespaceURI) {
            case 'http://www.w3.org/2000/svg':
                switch (qualifiedName.toUpperCase()) {
                    case 'PATH':
                        element = new SVGPathElement_1.SVGPathElement();
                        break;
                    case 'SVG':
                        element = new SVGElement_1.SVGElement();
                        break;
                    default:
                        console.log({ qualifiedName: qualifiedName, namespaceURI: namespaceURI });
                        process.exit();
                }
                ;
                break;
            default:
                console.log({ qualifiedName: qualifiedName, namespaceURI: namespaceURI });
                process.exit();
        }
        element.elementStore.tagName = function () { return qualifiedName; };
        element.nodeStore.ownerDocument = function () { return _this; };
        return element;
    };
    Document.prototype.createElement = function (localName) {
        var _this = this;
        var element;
        switch (localName.toUpperCase()) {
            case 'A':
                element = new HTMLAnchorElement_1.HTMLAnchorElement();
                break;
            case 'BUTTON':
                element = new HTMLButtonElement_1.HTMLButtonElement();
                break;
            case 'FORM':
                element = new HTMLFormElement_1.HTMLFormElement();
                break;
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':
                element = new HTMLHeadingElement_1.HTMLHeadingElement();
                break;
            case 'LABEL':
                element = new HTMLLabelElement_1.HTMLLabelElement();
                break;
            case 'DIV':
                element = new HTMLDivElement_1.HTMLDivElement();
                break;
            case 'IMG':
                element = new HTMLImageElement_1.HTMLImageElement();
                break;
            case 'INPUT':
                element = new HTMLInputElement_1.HTMLInputElement();
                break;
            case 'LI':
                element = new HTMLLIElement_1.HTMLLIElement();
                break;
            case 'SPAN':
                element = new HTMLSpanElement_1.HTMLSpanElement();
                break;
            case 'UL':
                element = new HTMLUListElement_1.HTMLUListElement();
                break;
            case 'PRE':
                element = new HTMLPreElement_1.HTMLPreElement();
                break;
            case 'P':
                element = new HTMLParagraphElement_1.HTMLParagraphElement();
                break;
            case 'CODE':
                element = new HTMLElement_1.HTMLElement();
                break;
            default: throw new Error('unknown element name: ' + localName);
        }
        element.elementStore.tagName = function () { return localName; };
        element.nodeStore.ownerDocument = function () { return _this; };
        return element;
    };
    Document.prototype._disconnect = function (node) {
        if (node instanceof Element_1.Element) {
            var elementsFuture_1 = this.documentStore.elements;
            this.documentStore.elements = function () {
                return (elementsFuture_1 ? elementsFuture_1() : [])
                    .filter(function (otherNode) { return otherNode !== node; });
            };
        }
    };
    Document.prototype.createTextNode = function (data) {
        var _this = this;
        var textNode = new Text_1.Text();
        textNode.nodeStore.ownerDocument = function () { return _this; };
        textNode.textStore.data = function () { return data; };
        return textNode;
    };
    Document.prototype.getElementById = function (id) {
        var attributeMatchingId = function (attribute) { return attribute
            .name === 'id' && attribute.value === id; };
        var elementMatchingId = function (element) { return element.getAttribute('id') === id; };
        return this
            .documentStore
            .elements()
            .find(elementMatchingId) || null;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Document.prototype.dispatchEvent = function (event) {
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Document.prototype.addEventListener = function (type, listener) {
    };
    Document.prototype.removeEventListener = function () {
    };
    Document.prototype.querySelectorAll = function (query) {
        return this.body.querySelectorAll(query);
    };
    Object.defineProperty(Document.prototype, "documentElement", {
        // should be html, but body for now
        get: function () {
            return this.body;
        },
        enumerable: false,
        configurable: true
    });
    return Document;
}());
exports.Document = Document;
