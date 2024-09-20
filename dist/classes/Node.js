"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
var valueNotSetError_1 = require("../utils/valueNotSetError");
var Element_1 = require("./Element");
var nextInstance = 1;
var NodeStore = /** @class */ (function () {
    function NodeStore() {
        this.nodeType = function () {
            throw (0, valueNotSetError_1.default)('nodeType');
        };
        this.ownerDocument = function () {
            throw (0, valueNotSetError_1.default)('ownerDocument');
        };
        this.parent = function () { return undefined; };
    }
    return NodeStore;
}());
var Node = /** @class */ (function () {
    function Node() {
        this.instance = nextInstance++;
        this.nodeStore = new NodeStore();
    }
    Node.prototype.dump = function () {
        return this.nodeType + ':' + this.instance + ((this instanceof Element_1.Element) ? ':' + this.tagName : '');
    };
    Object.defineProperty(Node.prototype, "nodeType", {
        get: function () {
            return this.nodeStore.nodeType();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "ownerDocument", {
        get: function () {
            return this.nodeStore.ownerDocument();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this.nodeStore.parent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parentNode", {
        get: function () {
            return this.nodeStore.parent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isConnected", {
        get: function () {
            return this.parentNode ? this.parentNode.isConnected : false;
        },
        enumerable: false,
        configurable: true
    });
    return Node;
}());
exports.Node = Node;
