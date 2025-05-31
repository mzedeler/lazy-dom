import { Future } from "../../types/Future";
import { NodeTypes } from "../../types/NodeTypes";
import { emptyIterator } from "../../utils/emptyIterator";
import { invariant } from "../../utils/invariant";
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
  set childNodes(cn: Future<Iterator<Node>>) {
    invariant('next' in cn(), 'cn must have next')
    this._childNodes = cn;
  }
  get childNodes(): Future<Iterator<Node<any>>> {
    return this._childNodes;
  }
  _childNodes: Future<Iterator<Node<any>>> = () => emptyIterator;
  nodeValue: Future<NV> = () => {
    throw valueNotSetError('nodeValue');
  };
}
