import { Future } from "../../types/Future";
import { NodeTypes } from "../../types/NodeTypes";
import { invariant } from "../../utils/invariant";
import { toIterator } from "../../utils/toIterator";
import valueNotSetError from "../../utils/valueNotSetError";
import { Document } from "../Document";
import { Node } from "./Node";

export class NodeStore<NV = null> {
  nodeType: Future<NodeTypes> = () => {
    throw valueNotSetError('nodeType');
  };
  ownerDocument: Future<Document> = () => {
    throw valueNotSetError('ownerDocument');
  };
  parent: Future<Node<any> | undefined> = () => undefined;

  _childNodes: () => Node<any>[] = () => [];

  set childNodes(cn: Future<Iterator<Node>>) {
    invariant('next' in cn(), 'cn must have next')
    let cached: Node<any>[] | null = null;
    this._childNodes = () => {
      if (cached === null) {
        cached = [...cn() as IterableIterator<Node<any>>];
      }
      return cached;
    };
  }

  get childNodes(): Future<Iterator<Node<any>>> {
    const arrayThunk = this._childNodes;
    return () => toIterator(arrayThunk());
  }

  getChildNode(index: number): Node<any> | undefined {
    return this._childNodes()[index];
  }

  getChildNodesArray(): Node<any>[] {
    return this._childNodes();
  }

  nodeValue: Future<NV> = () => {
    throw valueNotSetError('nodeValue');
  };
}
