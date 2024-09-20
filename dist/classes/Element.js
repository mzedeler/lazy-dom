"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
var NodeTypes_1 = require("../types/NodeTypes");
var valueNotSetError_1 = require("../utils/valueNotSetError");
var Text_1 = require("./Text");
var Node_1 = require("./Node");
var PointerEvent_1 = require("./PointerEvent");
var Attr_1 = require("./Attr");
var NamedNodeMap_1 = require("./NamedNodeMap");
var ElementStore = /** @class */ (function () {
    function ElementStore() {
        this.eventListeners = function () { return ({}); };
        this.tagName = function () {
            throw (0, valueNotSetError_1.default)('tagName');
        };
        this.childNodes = function () { return []; };
        this.style = function () { return ({}); };
        this.attributes = function () { return new NamedNodeMap_1.NamedNodeMap(); };
    }
    return ElementStore;
}());
var isEventTarget = function (node) {
    return Boolean(node.addEventListener && node.dispatchEvent);
};
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element() {
        var _this = _super.call(this) || this;
        _this.elementStore = new ElementStore();
        _this.nodeStore.nodeType = function () { return NodeTypes_1.NodeTypes.ELEMENT_NODE; };
        return _this;
    }
    Object.defineProperty(Element.prototype, "ownerDocument", {
        get: function () {
            return this.nodeStore.ownerDocument();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "tagName", {
        get: function () {
            return this.elementStore.tagName().toUpperCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "outerHTML", {
        get: function () {
            var attributes = __spreadArray([], this.elementStore.attributes(), true).map(function (attr) { return ' ' + attr.localName + '="' + attr.value + '"'; })
                .join('');
            var content = this.childNodes
                .map(function (node) {
                if (node instanceof Element) {
                    return node.outerHTML;
                }
                else if (node instanceof Text_1.Text) {
                    return node.data;
                }
            })
                .filter(function (segment) { return Boolean(segment); })
                .join('');
            return '<' + this.tagName.toLocaleLowerCase() + attributes + '>'
                + content
                + '</' + this.tagName.toLocaleLowerCase() + '>';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "childNodes", {
        get: function () {
            return this.elementStore.childNodes();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "style", {
        get: function () {
            return this.elementStore.style();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "textContent", {
        get: function () {
            return this.elementStore.childNodes().filter(function (childNode) { return childNode instanceof Text_1.Text; }).join('');
        },
        set: function (data) {
            var ownerDocumentFuture = this.nodeStore.ownerDocument;
            this.elementStore.childNodes = function () { return data.length === 0 ? [] : [
                ownerDocumentFuture().createTextNode(data)
            ]; };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "attributes", {
        get: function () {
            return this.elementStore.attributes();
        },
        enumerable: false,
        configurable: true
    });
    Element.prototype.setAttribute = function (localName, value) {
        var _this = this;
        var previousAttributesFuture = this.elementStore.attributes;
        this.elementStore.attributes = function () {
            var previousAttributes = previousAttributesFuture();
            var attr = new Attr_1.Attr(_this, localName, value);
            previousAttributes.setNamedItem(attr);
            return previousAttributes;
        };
        return;
    };
    Element.prototype.removeChild = function (node) {
        node.nodeStore.parent = function () { return undefined; };
        // Validation: node not child: throw NotFoundError DOMException
        var previousChildNodesFuture = this.elementStore.childNodes;
        this.elementStore.childNodes = function () {
            return previousChildNodesFuture().filter(function (childNode) { return childNode !== node; });
        };
        this.ownerDocument.documentStore.disconnect(node);
        return node;
    };
    Element.prototype.appendChild = function (node) {
        var _this = this;
        node.nodeStore.parent = function () { return _this; };
        var previousChildNodesFuture = this.elementStore.childNodes;
        this.elementStore.childNodes = function () {
            var childNodes = previousChildNodesFuture();
            childNodes.push(node);
            return childNodes;
        };
        this.ownerDocument.documentStore.connect(node);
        return node;
    };
    Object.defineProperty(Element.prototype, "addEventListener", {
        get: function () {
            var _this = this;
            return function (type, listener) {
                if (!listener) {
                    return;
                }
                var previousEventListenersFuture = _this.elementStore.eventListeners;
                _this.elementStore.eventListeners = function () {
                    var previousEventListeners = previousEventListenersFuture();
                    var queue = previousEventListeners[type];
                    if (!queue) {
                        queue = [];
                    }
                    queue.push(listener);
                    previousEventListeners[type] = queue;
                    return previousEventListeners;
                };
            };
        },
        enumerable: false,
        configurable: true
    });
    Element.prototype.dispatchEvent = function (event) {
        var listeners = this.elementStore.eventListeners();
        var queue = listeners[event.type];
        if (queue && queue.length) {
            queue.forEach(function (listener) { return listener(event); });
        }
        else {
            var parent_1 = this.nodeStore.parent();
            if (isEventTarget(parent_1)) {
                parent_1.dispatchEvent(event);
            }
        }
    };
    Element.prototype.click = function () {
        var _this = this;
        var event = new PointerEvent_1.PointerEvent();
        event.eventStore.type = function () { return 'click'; };
        event.eventStore.target = function () { return _this; };
        this.dispatchEvent(event);
    };
    Element.prototype.matches = function () {
        return false;
    };
    Element.prototype.getAttribute = function (qualifiedName) {
        var _a;
        return ((_a = this
            .elementStore
            .attributes()
            .getNamedItem(qualifiedName)) === null || _a === void 0 ? void 0 : _a.value) || null;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Element.prototype.querySelector = function (query) {
        throw new Error('unsupported method');
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Element.prototype.querySelectorAll = function (query) {
        return this.ownerDocument.all;
    };
    return Element;
}(Node_1.Node));
exports.Element = Element;
