"use strict";
// Bidirectional u32 (wasmId) ↔ Node map
// Every Node gets a wasmId at construction; this registry maps between them.
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.unregister = unregister;
exports.getNode = getNode;
exports.getNodeOrThrow = getNodeOrThrow;
exports.has = has;
const idToNode = new Map();
function register(wasmId, node) {
    idToNode.set(wasmId, node);
}
function unregister(wasmId) {
    idToNode.delete(wasmId);
}
function getNode(wasmId) {
    return idToNode.get(wasmId);
}
function getNodeOrThrow(wasmId) {
    const node = idToNode.get(wasmId);
    if (!node) {
        throw new Error(`NodeRegistry: no node for wasmId ${wasmId}`);
    }
    return node;
}
function has(wasmId) {
    return idToNode.has(wasmId);
}
