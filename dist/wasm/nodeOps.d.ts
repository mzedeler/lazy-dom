export declare function createNode(nodeType: number): number;
export declare function destroyNode(nodeId: number): void;
export declare function getNodeType(nodeId: number): number;
export declare function getParentId(nodeId: number): number;
export declare function setParentId(nodeId: number, parentId: number): void;
export declare function getOwnerDocumentId(nodeId: number): number;
export declare function setOwnerDocumentId(nodeId: number, docId: number): void;
export declare function appendChild(parentId: number, childId: number): void;
export declare function insertBefore(parentId: number, newChildId: number, refChildId: number): void;
export declare function removeChild(parentId: number, childId: number): void;
export declare function clearChildren(nodeId: number): void;
export declare function getChildCount(nodeId: number): number;
export declare function getChildId(nodeId: number, index: number): number;
/** Returns a JS array of child IDs (copies from WASM memory) */
export declare function getChildIds(nodeId: number): number[];
export declare function createDocument(): number;
export declare function destroyDocument(docId: number): void;
export declare function getDocumentBodyId(docId: number): number;
export declare function setDocumentBodyId(docId: number, bodyId: number): void;
export declare function connectSubtree(docId: number, rootId: number): void;
export declare function disconnectSubtree(docId: number, rootId: number): void;
export declare function disconnectElement(docId: number, elementId: number): void;
export declare function getConnectedElementCount(docId: number): number;
/** Returns a JS array of connected element IDs (copies from WASM memory) */
export declare function getConnectedElementIds(docId: number): number[];
