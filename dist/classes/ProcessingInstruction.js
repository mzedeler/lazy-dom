"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingInstruction = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
const Node_1 = require("./Node/Node");
class ProcessingInstruction extends Node_1.Node {
    target;
    constructor(target, data) {
        super(NodeTypes_1.NodeTypes.PROCESSING_INSTRUCTION_NODE);
        this.target = target;
        this.nodeStore.nodeValue = () => data;
    }
    get nodeName() {
        return this.target;
    }
    get data() {
        return this.nodeStore.nodeValue() ?? '';
    }
    set data(data) {
        this.nodeStore.nodeValue = () => data;
    }
    get nodeValue() {
        return this.data;
    }
    set nodeValue(value) {
        this.data = value;
    }
    attributes = null;
    _cloneNodeShallow() {
        return this.ownerDocument.createProcessingInstruction(this.target, this.data);
    }
}
exports.ProcessingInstruction = ProcessingInstruction;
