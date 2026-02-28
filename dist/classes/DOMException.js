"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMException = void 0;
class DOMException extends Error {
    static INDEX_SIZE_ERR = 1;
    static HIERARCHY_REQUEST_ERR = 3;
    static WRONG_DOCUMENT_ERR = 4;
    static INVALID_CHARACTER_ERR = 5;
    static NOT_FOUND_ERR = 8;
    static NOT_SUPPORTED_ERR = 9;
    static INUSE_ATTRIBUTE_ERR = 10;
    static NAMESPACE_ERR = 14;
    code;
    constructor(message, name = 'DOMException', code = 0) {
        super(message);
        this.name = name;
        this.code = code;
    }
}
exports.DOMException = DOMException;
