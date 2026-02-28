import { ASUtil } from "@assemblyscript/loader";
export interface WasmExports extends ASUtil {
    [key: string]: unknown;
    createNode(nodeType: number): number;
    destroyNode(nodeId: number): void;
    getNodeType(nodeId: number): number;
    getParentId(nodeId: number): number;
    setParentId(nodeId: number, parentId: number): void;
    getOwnerDocumentId(nodeId: number): number;
    setOwnerDocumentId(nodeId: number, docId: number): void;
    appendChild(parentId: number, childId: number): void;
    removeChild(parentId: number, childId: number): void;
    clearChildren(nodeId: number): void;
    getChildCount(nodeId: number): number;
    getChildId(nodeId: number, index: number): number;
    getChildIds(nodeId: number): number;
    insertBefore(parentId: number, newChildId: number, refChildId: number): void;
    hasNode(nodeId: number): boolean;
    createDocument(): number;
    destroyDocument(docId: number): void;
    getDocumentBodyId(docId: number): number;
    setDocumentBodyId(docId: number, bodyId: number): void;
    connectSubtree(docId: number, rootId: number): void;
    disconnectSubtree(docId: number, rootId: number): void;
    disconnectElement(docId: number, elementId: number): void;
    getConnectedElementCount(docId: number): number;
    getConnectedElementIds(docId: number): number;
}
export declare const wasm: WasmExports;
