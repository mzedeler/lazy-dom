"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMImplementation = void 0;
class DOMImplementation {
    hasFeature(_feature, _version) {
        // DOM Level 2 spec: always returns true
        return true;
    }
}
exports.DOMImplementation = DOMImplementation;
