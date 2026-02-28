import { Future } from "../../types/Future";
import valueNotSetError from "../../utils/valueNotSetError";
import { Document } from "../Document";
import { Node } from "./Node";
import * as nodeOps from "../../wasm/nodeOps";
import * as NodeRegistry from "../../wasm/NodeRegistry";

export class NodeStore {
  wasmId: number;

  ownerDocument: Future<Document> = () => {
    throw valueNotSetError('ownerDocument');
  };

  constructor(wasmId: number) {
    this.wasmId = wasmId;
  }

  getChildNode(index: number): Node | undefined {
    const childId = nodeOps.getChildId(this.wasmId, index);
    if (childId === 0) return undefined;
    return NodeRegistry.getNode(childId);
  }

  getChildNodesArray(): Node[] {
    const ids = nodeOps.getChildIds(this.wasmId);
    const result: Node[] = new Array(ids.length);
    for (let i = 0; i < ids.length; i++) {
      result[i] = NodeRegistry.getNodeOrThrow(ids[i]);
    }
    return result;
  }

  getChildCount(): number {
    return nodeOps.getChildCount(this.wasmId);
  }

  nodeValue: Future<string | null> = () => {
    throw valueNotSetError('nodeValue');
  };
}
