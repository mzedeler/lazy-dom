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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
var NodeTypes_1 = require("../types/NodeTypes");
var valueNotSetError_1 = require("../utils/valueNotSetError");
var Node_1 = require("./Node");
var TextStore = /** @class */ (function () {
    function TextStore() {
        this.data = function () {
            throw (0, valueNotSetError_1.default)('data');
        };
    }
    return TextStore;
}());
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        var _this = _super.call(this) || this;
        _this.textStore = new TextStore();
        _this.nodeStore.nodeType = function () { return NodeTypes_1.NodeTypes.TEXT_NODE; };
        return _this;
    }
    Object.defineProperty(Text.prototype, "textContent", {
        get: function () {
            return this.textStore.data();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "data", {
        get: function () {
            return this.textStore.data();
        },
        set: function (data) {
            this.textStore.data = function () { return data; };
        },
        enumerable: false,
        configurable: true
    });
    return Text;
}(Node_1.Node));
exports.Text = Text;
