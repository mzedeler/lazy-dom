import { Future } from "../../types/Future";
import { NodeTypes } from "../../types/NodeTypes";
import { emptyIterator } from "../../utils/emptyIterator";
import { invariant } from "../../utils/invariant";
import { toIterator } from "../../utils/toIterator";
import valueNotSetError from "../../utils/valueNotSetError";
import { Document } from "../Document";
import { Node } from "./Node";

const childNodesCache = new WeakMap<Function, Node<any>[]>();

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

  private materializeChildNodes(): Node<any>[] {
    const fn = this._childNodes;
    let cached = childNodesCache.get(fn);
    if (!cached) {
      cached = [...fn() as IterableIterator<Node<any>>];
      childNodesCache.set(fn, cached);
      const nodes = cached;
      this._childNodes = () => toIterator(nodes);
      childNodesCache.set(this._childNodes, nodes);
    }
    return cached;
  }

  getChildNode(index: number): Node<any> | undefined {
    return this.materializeChildNodes()[index];
  }

  getChildNodesArray(): Node<any>[] {
    return this.materializeChildNodes();
  }
  nodeValue: Future<NV> = () => {
    throw valueNotSetError('nodeValue');
  };
}
