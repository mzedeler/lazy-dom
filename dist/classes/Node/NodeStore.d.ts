import { Future } from "../../types/Future";
import { Document } from "../Document";
import { Node } from "./Node";
export declare class NodeStore<NV = null> {
    wasmId: number;
    ownerDocument: Future<Document>;
    constructor(wasmId: number);
    getChildNode(index: number): Node<any> | undefined;
    getChildNodesArray(): Node<any>[];
    getChildCount(): number;
    nodeValue: Future<NV>;
}
