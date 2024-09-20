"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
var Window = /** @class */ (function () {
    function Window() {
    }
    Object.defineProperty(Window.prototype, "location", {
        get: function () {
            return {
                href: 'http://localhost:9009/b'
            };
        },
        enumerable: false,
        configurable: true
    });
    Window.prototype.getComputedStyle = function () {
        return {};
    };
    return Window;
}());
exports.Window = Window;
