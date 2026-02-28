"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeStore = void 0;
const valueNotSetError_1 = __importDefault(require("../../utils/valueNotSetError"));
const nodeOps = __importStar(require("../../wasm/nodeOps"));
const NodeRegistry = __importStar(require("../../wasm/NodeRegistry"));
class NodeStore {
    wasmId;
    ownerDocument = () => {
        throw (0, valueNotSetError_1.default)('ownerDocument');
    };
    constructor(wasmId) {
        this.wasmId = wasmId;
    }
    getChildNode(index) {
        const childId = nodeOps.getChildId(this.wasmId, index);
        if (childId === 0)
            return undefined;
        return NodeRegistry.getNode(childId);
    }
    getChildNodesArray() {
        const ids = nodeOps.getChildIds(this.wasmId);
        const result = new Array(ids.length);
        for (let i = 0; i < ids.length; i++) {
            result[i] = NodeRegistry.getNodeOrThrow(ids[i]);
        }
        return result;
    }
    getChildCount() {
        return nodeOps.getChildCount(this.wasmId);
    }
    nodeValue = () => {
        throw (0, valueNotSetError_1.default)('nodeValue');
    };
}
exports.NodeStore = NodeStore;
