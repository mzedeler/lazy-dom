"use strict";
// Typed JS wrapper over WASM exports for node operations
// Provides a clean API that hides pointer-level details
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNode = createNode;
exports.destroyNode = destroyNode;
exports.getNodeType = getNodeType;
exports.getParentId = getParentId;
exports.setParentId = setParentId;
exports.getOwnerDocumentId = getOwnerDocumentId;
exports.setOwnerDocumentId = setOwnerDocumentId;
exports.appendChild = appendChild;
exports.insertBefore = insertBefore;
exports.removeChild = removeChild;
exports.clearChildren = clearChildren;
exports.getChildCount = getChildCount;
exports.getChildId = getChildId;
exports.getChildIds = getChildIds;
exports.createDocument = createDocument;
exports.destroyDocument = destroyDocument;
exports.getDocumentBodyId = getDocumentBodyId;
exports.setDocumentBodyId = setDocumentBodyId;
exports.connectSubtree = connectSubtree;
exports.disconnectSubtree = disconnectSubtree;
exports.disconnectElement = disconnectElement;
exports.getConnectedElementCount = getConnectedElementCount;
exports.getConnectedElementIds = getConnectedElementIds;
const wasmLoader_1 = require("./wasmLoader");
// --- Node lifecycle ---
function createNode(nodeType) {
    return wasmLoader_1.wasm.createNode(nodeType);
}
function destroyNode(nodeId) {
    wasmLoader_1.wasm.destroyNode(nodeId);
}
// --- Node properties ---
function getNodeType(nodeId) {
    return wasmLoader_1.wasm.getNodeType(nodeId);
}
function getParentId(nodeId) {
    return wasmLoader_1.wasm.getParentId(nodeId);
}
function setParentId(nodeId, parentId) {
    wasmLoader_1.wasm.setParentId(nodeId, parentId);
}
function getOwnerDocumentId(nodeId) {
    return wasmLoader_1.wasm.getOwnerDocumentId(nodeId);
}
function setOwnerDocumentId(nodeId, docId) {
    wasmLoader_1.wasm.setOwnerDocumentId(nodeId, docId);
}
// --- Child management ---
function appendChild(parentId, childId) {
    wasmLoader_1.wasm.appendChild(parentId, childId);
}
function insertBefore(parentId, newChildId, refChildId) {
    wasmLoader_1.wasm.insertBefore(parentId, newChildId, refChildId);
}
function removeChild(parentId, childId) {
    wasmLoader_1.wasm.removeChild(parentId, childId);
}
function clearChildren(nodeId) {
    wasmLoader_1.wasm.clearChildren(nodeId);
}
function getChildCount(nodeId) {
    return wasmLoader_1.wasm.getChildCount(nodeId);
}
function getChildId(nodeId, index) {
    return wasmLoader_1.wasm.getChildId(nodeId, index);
}
/** Returns a JS array of child IDs (copies from WASM memory) */
function getChildIds(nodeId) {
    const ptr = wasmLoader_1.wasm.getChildIds(nodeId);
    return wasmLoader_1.wasm.__getArray(ptr);
}
// --- Document registry ---
function createDocument() {
    return wasmLoader_1.wasm.createDocument();
}
function destroyDocument(docId) {
    wasmLoader_1.wasm.destroyDocument(docId);
}
function getDocumentBodyId(docId) {
    return wasmLoader_1.wasm.getDocumentBodyId(docId);
}
function setDocumentBodyId(docId, bodyId) {
    wasmLoader_1.wasm.setDocumentBodyId(docId, bodyId);
}
function connectSubtree(docId, rootId) {
    wasmLoader_1.wasm.connectSubtree(docId, rootId);
}
function disconnectSubtree(docId, rootId) {
    wasmLoader_1.wasm.disconnectSubtree(docId, rootId);
}
function disconnectElement(docId, elementId) {
    wasmLoader_1.wasm.disconnectElement(docId, elementId);
}
function getConnectedElementCount(docId) {
    return wasmLoader_1.wasm.getConnectedElementCount(docId);
}
/** Returns a JS array of connected element IDs (copies from WASM memory) */
function getConnectedElementIds(docId) {
    const ptr = wasmLoader_1.wasm.getConnectedElementIds(docId);
    return wasmLoader_1.wasm.__getArray(ptr);
}
