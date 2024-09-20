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
exports.PointerEvent = void 0;
var Event_1 = require("./Event");
var UIEvent = /** @class */ (function (_super) {
    __extends(UIEvent, _super);
    function UIEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UIEvent;
}(Event_1.Event));
var MouseEvent = /** @class */ (function (_super) {
    __extends(MouseEvent, _super);
    function MouseEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MouseEvent;
}(UIEvent));
var PointerEvent = /** @class */ (function (_super) {
    __extends(PointerEvent, _super);
    function PointerEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PointerEvent;
}(MouseEvent));
exports.PointerEvent = PointerEvent;
