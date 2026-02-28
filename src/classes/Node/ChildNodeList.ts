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
          if (!isNaN(index) && index >= 0) {
            return target.nodeStore.getChildNode(index);
          }
        }
        return Reflect.get(target, prop, receiver);
      },
      has(target, prop) {
        if (typeof prop === 'string') {
          const index = Number(prop);
          if (!isNaN(index) && index >= 0) {
            return index < target.nodeStore.getChildCount();
          }
        }
        return Reflect.has(target, prop);
      },
    });
  }

  get length() {
    return this.nodeStore.getChildCount();
  }

  item(index: number) {
    return this.nodeStore.getChildNode(index) ?? null;
  }

  forEach(callback: (currentValue: Node, currentIndex: number, listObj: NodeList) => void) {
    const children = this.nodeStore.getChildNodesArray();
    for (let i = 0; i < children.length; i++) {
      callback(children[i], i, this);
    }
    return undefined;
  }

  keys() {
    return this.nodeStore.getChildNodesArray().map((_, i) => i).values();
  }

  entries() {
    return this.nodeStore.getChildNodesArray().map<[number, Node]>((node, i) => [i, node]).values();
  }

  values() {
    return this.nodeStore.getChildNodesArray().values();
  }

  [Symbol.iterator]() {
    return this.nodeStore.getChildNodesArray().values();
  }
}
