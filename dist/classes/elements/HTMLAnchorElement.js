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
exports.HTMLAnchorElement = void 0;
var Element_1 = require("../Element");
var HTMLAnchorElement = /** @class */ (function (_super) {
    __extends(HTMLAnchorElement, _super);
    function HTMLAnchorElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HTMLAnchorElement.prototype, "href", {
        get: function () {
            return new URL(this.attributes.getNamedItem('href').value).href;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLAnchorElement.prototype, "pathname", {
        get: function () {
            return new URL(this.attributes.getNamedItem('href').value).href;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLAnchorElement.prototype, "protocol", {
        get: function () {
            return new URL(this.attributes.getNamedItem('href').value).protocol;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLAnchorElement.prototype, "host", {
        get: function () {
            return new URL(this.attributes.getNamedItem('href').value).host;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLAnchorElement.prototype, "search", {
        get: function () {
            return new URL(this.attributes.getNamedItem('href').value).search;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLAnchorElement.prototype, "hash", {
        get: function () {
            return new URL(this.attributes.getNamedItem('href').value).hash;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLAnchorElement.prototype, "hostname", {
        get: function () {
            return new URL(this.attributes.getNamedItem('href').value).hostname;
        },
        enumerable: false,
        configurable: true
    });
    return HTMLAnchorElement;
}(Element_1.Element));
exports.HTMLAnchorElement = HTMLAnchorElement;
