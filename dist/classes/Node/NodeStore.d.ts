import { Future } from "../../types/Future";
import { Document } from "../Document";
import { Node } from "./Node";
export declare class NodeStore {
    wasmId: number;
    ownerDocument: Future<Document>;
    constructor(wasmId: number);
    getChildNode(index: number): Node | undefined;
    getChildNodesArray(): Node[];
    getChildCount(): number;
    nodeValue: Future<string | null>;
}
