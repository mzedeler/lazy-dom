// Document element registry in WASM
// Tracks connected element IDs per document

import { getChildCount, getChildId, getNodeType } from "./NodeTable";

class DocumentEntry {
  bodyId: u32;
  connectedElementIds: Set<u32>;

  constructor() {
    this.bodyId = 0;
    this.connectedElementIds = new Set<u32>();
  }
}

const documents = new Map<u32, DocumentEntry>();
let nextDocId: u32 = 1;

// Node type constants (matching NodeTypes enum)
const ELEMENT_NODE: u8 = 1;

export function createDocument(): u32 {
  const id = nextDocId++;
  documents.set(id, new DocumentEntry());
  return id;
}

export function destroyDocument(docId: u32): void {
  documents.delete(docId);
}

export function getDocumentBodyId(docId: u32): u32 {
  const doc = documents.get(docId);
  return doc.bodyId;
}

export function setDocumentBodyId(docId: u32, bodyId: u32): void {
  const doc = documents.get(docId);
  doc.bodyId = bodyId;
}

export function connectSubtree(docId: u32, rootId: u32): void {
  const doc = documents.get(docId);
  const connected = doc.connectedElementIds;

  // Inline subtree walk — no closures needed
  const stack = new Array<u32>(1);
  unchecked(stack[0] = rootId);

  while (stack.length > 0) {
    const nodeId = stack.pop();
    if (getNodeType(nodeId) === ELEMENT_NODE) {
      connected.add(nodeId);
    }
    const count = getChildCount(nodeId);
    for (let i: u32 = 0; i < count; i++) {
      stack.push(getChildId(nodeId, i));
    }
  }
}

export function disconnectSubtree(docId: u32, rootId: u32): void {
  const doc = documents.get(docId);
  const connected = doc.connectedElementIds;

  const stack = new Array<u32>(1);
  unchecked(stack[0] = rootId);

  while (stack.length > 0) {
    const nodeId = stack.pop();
    connected.delete(nodeId);
    const count = getChildCount(nodeId);
    for (let i: u32 = 0; i < count; i++) {
      stack.push(getChildId(nodeId, i));
    }
  }
}

export function disconnectElement(docId: u32, elementId: u32): void {
  const doc = documents.get(docId);
  doc.connectedElementIds.delete(elementId);
}

export function getConnectedElementCount(docId: u32): u32 {
  const doc = documents.get(docId);
  return doc.connectedElementIds.size;
}

export function getConnectedElementIds(docId: u32): StaticArray<u32> {
  const doc = documents.get(docId);
  const ids = doc.connectedElementIds;
  const arr = ids.values();
  const result = new StaticArray<u32>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    unchecked(result[i] = unchecked(arr[i]));
  }
  return result;
}
