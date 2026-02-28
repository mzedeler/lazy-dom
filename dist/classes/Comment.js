"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
const CharacterData_1 = require("./CharacterData");
class Comment extends CharacterData_1.CharacterData {
    nodeName = '#comment';
    _data;
    constructor(data = '') {
        super(NodeTypes_1.NodeTypes.COMMENT_NODE);
        this._data = data;
    }
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }
    get nodeValue() {
        return this._data;
    }
    set nodeValue(value) {
        this._data = value;
    }
    _cloneNodeShallow() {
        return this.ownerDocument.createComment(this._data);
    }
}
exports.Comment = Comment;
