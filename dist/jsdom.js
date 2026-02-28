"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSDOM = void 0;
const lazyDom_1 = __importDefault(require("./lazyDom"));
class JSDOM {
    _window;
    constructor(_html = "", _options = {}) {
        const { window } = (0, lazyDom_1.default)();
        this._window = window;
        // global-jsdom checks for "Node.js" in userAgent
        this._window.navigator = {
            userAgent: `Node.js/${process.versions.node}`,
        };
        if (_options.url) {
            this._window.location = { href: _options.url };
        }
    }
    get window() {
        return this._window;
    }
    serialize() {
        return "";
    }
}
exports.JSDOM = JSDOM;
