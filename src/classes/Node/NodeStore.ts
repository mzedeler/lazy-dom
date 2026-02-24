import { Future } from "../../types/Future";
import valueNotSetError from "../../utils/valueNotSetError";
import { Document } from "../Document";
import { Node } from "./Node";
import * as nodeOps from "../../wasm/nodeOps";
import * as NodeRegistry from "../../wasm/NodeRegistry";

export class NodeStore<NV = null> {
  wasmId: number;

  ownerDocument: Future<Document> = () => {
    throw valueNotSetError('ownerDocument');
  };

  constructor(wasmId: number) {
    this.wasmId = wasmId;
  }

  getChildNode(index: number): Node<any> | undefined {
    const childId = nodeOps.getChildId(this.wasmId, index);
    if (childId === 0) return undefined;
    return NodeRegistry.getNode(childId);
  }

  getChildNodesArray(): Node<any>[] {
    const ids = nodeOps.getChildIds(this.wasmId);
    const result: Node<any>[] = new Array(ids.length);
    for (let i = 0; i < ids.length; i++) {
      result[i] = NodeRegistry.getNodeOrThrow(ids[i]);
    }
    return result;
  }

  getChildCount(): number {
    return nodeOps.getChildCount(this.wasmId);
  }

  nodeValue: Future<NV> = () => {
    throw valueNotSetError('nodeValue');
  };
}
