// Typed JS wrapper over WASM exports for node operations
// Provides a clean API that hides pointer-level details

import { wasm } from "./wasmLoader";

// --- Node lifecycle ---

export function createNode(nodeType: number): number {
  return wasm.createNode(nodeType);
}

export function destroyNode(nodeId: number): void {
  wasm.destroyNode(nodeId);
}

// --- Node properties ---

export function getNodeType(nodeId: number): number {
  return wasm.getNodeType(nodeId);
}

export function getParentId(nodeId: number): number {
  return wasm.getParentId(nodeId);
}

export function setParentId(nodeId: number, parentId: number): void {
  wasm.setParentId(nodeId, parentId);
}

export function getOwnerDocumentId(nodeId: number): number {
  return wasm.getOwnerDocumentId(nodeId);
}

export function setOwnerDocumentId(nodeId: number, docId: number): void {
  wasm.setOwnerDocumentId(nodeId, docId);
}

// --- Child management ---

export function appendChild(parentId: number, childId: number): void {
  wasm.appendChild(parentId, childId);
}

export function insertBefore(parentId: number, newChildId: number, refChildId: number): void {
  wasm.insertBefore(parentId, newChildId, refChildId);
}

export function removeChild(parentId: number, childId: number): void {
  wasm.removeChild(parentId, childId);
}

export function clearChildren(nodeId: number): void {
  wasm.clearChildren(nodeId);
}

export function getChildCount(nodeId: number): number {
  return wasm.getChildCount(nodeId);
}

export function getChildId(nodeId: number, index: number): number {
  return wasm.getChildId(nodeId, index);
}

/** Returns a JS array of child IDs (copies from WASM memory) */
export function getChildIds(nodeId: number): number[] {
  const ptr = wasm.getChildIds(nodeId);
  return wasm.__getArray(ptr);
}

// --- Document registry ---

export function createDocument(): number {
  return wasm.createDocument();
}

export function destroyDocument(docId: number): void {
  wasm.destroyDocument(docId);
}

export function getDocumentBodyId(docId: number): number {
  return wasm.getDocumentBodyId(docId);
}

export function setDocumentBodyId(docId: number, bodyId: number): void {
  wasm.setDocumentBodyId(docId, bodyId);
}

export function connectSubtree(docId: number, rootId: number): void {
  wasm.connectSubtree(docId, rootId);
}

export function disconnectSubtree(docId: number, rootId: number): void {
  wasm.disconnectSubtree(docId, rootId);
}

export function disconnectElement(docId: number, elementId: number): void {
  wasm.disconnectElement(docId, elementId);
}

export function getConnectedElementCount(docId: number): number {
  return wasm.getConnectedElementCount(docId);
}

/** Returns a JS array of connected element IDs (copies from WASM memory) */
export function getConnectedElementIds(docId: number): number[] {
  const ptr = wasm.getConnectedElementIds(docId);
  return wasm.__getArray(ptr);
}
