"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
const valueNotSetError_1 = __importDefault(require("../utils/valueNotSetError"));
const CharacterData_1 = require("./CharacterData");
class TextStore {
    data = () => {
        throw (0, valueNotSetError_1.default)('data');
    };
}
class Text extends CharacterData_1.CharacterData {
    textStore = new TextStore();
    nodeName = '#text';
    constructor() {
        super(NodeTypes_1.NodeTypes.TEXT_NODE);
    }
    get textContent() {
        return this.textStore.data();
    }
    get data() {
        return this.textStore.data();
    }
    set data(data) {
        this.textStore.data = () => data;
    }
    get nodeValue() {
        return this.textStore.data();
    }
    set nodeValue(value) {
        this.textStore.data = () => value;
    }
    _cloneNodeShallow() {
        return this.ownerDocument.createTextNode(this.data);
    }
    splitText(offset) {
        if (offset < 0 || offset > this.data.length) {
            throw new Error('INDEX_SIZE_ERR');
        }
        const newData = this.data.substring(offset);
        this.data = this.data.substring(0, offset);
        const newText = this.ownerDocument.createTextNode(newData);
        // Insert after this node in the parent
        const parent = this.parentNode;
        if (parent) {
            const nextSib = this.nextSibling;
            if (nextSib) {
                parent.insertBefore(newText, nextSib);
            }
            else {
                parent.appendChild(newText);
            }
        }
        return newText;
    }
}
exports.Text = Text;
