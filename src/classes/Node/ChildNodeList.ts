import { toIterator } from "../../utils/toIterator";
import { NodeList } from "../NodeList";
import { Node } from "./Node";
import { NodeStore } from "./NodeStore";

export class ChildNodeList<NV> extends NodeList {
  nodeStore: NodeStore<NV>;

  constructor(nodeStore: NodeStore<NV>) {
    super();
    this.nodeStore = nodeStore;

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === 'string') {
          const index = Number(prop);
          if (Number.isInteger(index) && index >= 0) {
            return target.nodeStore.getChildNode(index);
          }
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  get length() {
    return this.nodeStore.getChildNodesArray().length;
  }

  item(index: number) {
    return this.nodeStore.getChildNode(index) ?? null;
  }

  forEach(callback: (currentValue: Node, currentIndex: number, listObj: NodeList) => void) {
    this.nodeStore.getChildNodesArray().forEach((node, i) => callback(node, i, this));
    return undefined;
  }

  keys() {
    return toIterator(this.nodeStore.getChildNodesArray().map((_, i) => i));
  }

  entries() {
    return toIterator(this.nodeStore.getChildNodesArray().map<[number, Node]>((node, i) => [i, node]));
  }

  values() {
    return toIterator(this.nodeStore.getChildNodesArray());
  }

  [Symbol.iterator]() {
    return this.nodeStore.childNodes()
  }
}
