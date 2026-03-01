// Node storage in WASM linear memory
// Each node is identified by a u32 ID (1-based, 0 = none)

export class NodeEntry {
  nodeType: u8;
  parentId: u32;
  ownerDocumentId: u32;
  childIds: Array<u32>;

  constructor(nodeType: u8) {
    this.nodeType = nodeType;
    this.parentId = 0;
    this.ownerDocumentId = 0;
    this.childIds = new Array<u32>(0);
  }
}

// Sparse array of nodes indexed by ID
const nodes = new Map<u32, NodeEntry>();
let nextId: u32 = 1;

export function createNode(nodeType: u8): u32 {
  const id = nextId++;
  nodes.set(id, new NodeEntry(nodeType));
  return id;
}

export function destroyNode(nodeId: u32): void {
  nodes.delete(nodeId);
}

export function getNodeType(nodeId: u32): u8 {
  const entry = nodes.get(nodeId);
  return entry.nodeType;
}

export function getParentId(nodeId: u32): u32 {
  const entry = nodes.get(nodeId);
  return entry.parentId;
}

export function setParentId(nodeId: u32, parentId: u32): void {
  const entry = nodes.get(nodeId);
  entry.parentId = parentId;
}

export function getOwnerDocumentId(nodeId: u32): u32 {
  const entry = nodes.get(nodeId);
  return entry.ownerDocumentId;
}

export function setOwnerDocumentId(nodeId: u32, docId: u32): void {
  const entry = nodes.get(nodeId);
  entry.ownerDocumentId = docId;
}

export function appendChild(parentId: u32, childId: u32): void {
  const parent = nodes.get(parentId);
  parent.childIds.push(childId);
}

export function insertBefore(parentId: u32, newChildId: u32, refChildId: u32): void {
  const parent = nodes.get(parentId);
  const children = parent.childIds;
  if (refChildId === 0) {
    children.push(newChildId);
  } else {
    const idx = children.indexOf(refChildId);
    if (idx >= 0) {
      const newChildren = new Array<u32>(children.length + 1);
      for (let i = 0; i < idx; i++) {
        unchecked(newChildren[i] = children[i]);
      }
      unchecked(newChildren[idx] = newChildId);
      for (let i = idx; i < children.length; i++) {
        unchecked(newChildren[i + 1] = children[i]);
      }
      parent.childIds = newChildren;
    }
  }
}

export function removeChild(parentId: u32, childId: u32): void {
  const parent = nodes.get(parentId);
  const children = parent.childIds;
  const idx = children.indexOf(childId);
  if (idx >= 0) {
    children.splice(idx, 1);
  }
}

export function clearChildren(nodeId: u32): void {
  const entry = nodes.get(nodeId);
  entry.childIds = new Array<u32>(0);
}

export function getChildCount(nodeId: u32): u32 {
  const entry = nodes.get(nodeId);
  return entry.childIds.length;
}

export function getChildId(nodeId: u32, index: u32): u32 {
  const entry = nodes.get(nodeId);
  if (index >= <u32>entry.childIds.length) return 0;
  return unchecked(entry.childIds[index]);
}

export function getChildIds(nodeId: u32): StaticArray<u32> {
  const entry = nodes.get(nodeId);
  const children = entry.childIds;
  const result = new StaticArray<u32>(children.length);
  for (let i = 0; i < children.length; i++) {
    unchecked(result[i] = children[i]);
  }
  return result;
}

export function hasNode(nodeId: u32): bool {
  return nodes.has(nodeId);
}
