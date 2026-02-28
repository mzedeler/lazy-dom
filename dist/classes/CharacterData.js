"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterData = void 0;
const Node_1 = require("./Node/Node");
const DOMException_1 = require("./DOMException");
class CharacterData extends Node_1.Node {
    constructor(nodeType) {
        super(nodeType);
    }
    get nodeValue() {
        return this.data;
    }
    set nodeValue(value) {
        this.data = value;
    }
    get textContent() {
        return this.data;
    }
    get length() {
        return this.data.length;
    }
    appendData(data) {
        this.data = this.data + data;
    }
    deleteData(offset, count) {
        if (offset < 0 || offset > this.data.length) {
            throw new DOMException_1.DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException_1.DOMException.INDEX_SIZE_ERR);
        }
        const current = this.data;
        this.data = current.substring(0, offset) + current.substring(offset + count);
    }
    insertData(offset, arg) {
        if (offset < 0 || offset > this.data.length) {
            throw new DOMException_1.DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException_1.DOMException.INDEX_SIZE_ERR);
        }
        const current = this.data;
        this.data = current.substring(0, offset) + arg + current.substring(offset);
    }
    replaceData(offset, count, arg) {
        if (offset < 0 || offset > this.data.length) {
            throw new DOMException_1.DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException_1.DOMException.INDEX_SIZE_ERR);
        }
        const current = this.data;
        this.data = current.substring(0, offset) + arg + current.substring(offset + count);
    }
    substringData(offset, count) {
        if (offset < 0 || offset > this.data.length) {
            throw new DOMException_1.DOMException('INDEX_SIZE_ERR', 'IndexSizeError', DOMException_1.DOMException.INDEX_SIZE_ERR);
        }
        return this.data.substring(offset, offset + count);
    }
}
exports.CharacterData = CharacterData;
