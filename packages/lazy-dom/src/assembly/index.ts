// WASM module entry point — re-exports all public APIs

export {
  createNode,
  destroyNode,
  getNodeType,
  getParentId,
  setParentId,
  getOwnerDocumentId,
  setOwnerDocumentId,
  appendChild,
  insertBefore,
  removeChild,
  clearChildren,
  getChildCount,
  getChildId,
  getChildIds,
  hasNode,
  resetNodeTable,
} from "./NodeTable";

export {
  createDocument,
  destroyDocument,
  getDocumentBodyId,
  setDocumentBodyId,
  connectSubtree,
  disconnectSubtree,
  disconnectElement,
  getConnectedElementCount,
  getConnectedElementIds,
  resetDocumentTable,
} from "./DocumentTable";
