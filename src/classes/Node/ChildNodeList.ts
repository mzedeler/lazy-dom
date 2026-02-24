import { splice } from "../../utils/splice";
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
            return target.item(index);
          }
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  get length() {
    const nodes: Node[] = [];
    const iterator = this.nodeStore.childNodes();
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      nodes.push(value);
    }
    this.nodeStore.childNodes = () => toIterator<Node>(nodes);
    return nodes.length;
  }

  item(index: number) {
    if (index < 0) {
      return null;
    }

    const nodes: Node[] = [];
    const iterator = this.nodeStore.childNodes();
    let result: Node | null = null;
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      nodes.push(value);
      if (nodes.length - 1 === index) {
        result = value;
        break;
      }
    }

    this.nodeStore.childNodes = () => splice(toIterator<Node>(nodes), iterator);

    return result;
  }

  forEach(callback: (currentValue: Node, currentIndex: number, listObj: NodeList) => void) {
    const iterator = this.nodeStore.childNodes();
    let currentIndex = 0;
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      callback(value, currentIndex++, this);
    }
    return undefined;
  }

  keys() {
    const nodes: Node[] = [];
    const iterator = this.nodeStore.childNodes();
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      nodes.push(value);
    }
    this.nodeStore.childNodes = () => toIterator<Node>(nodes);

    return toIterator(nodes.map((_, i) => i));
  }

  entries() {
    const nodes: Node[] = [];
    const iterator = this.nodeStore.childNodes();
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      nodes.push(value);
    }
    this.nodeStore.childNodes = () => toIterator<Node>(nodes);

    return toIterator(nodes.map<[number, Node]>((node, i) => [i, node]));
  }

  values() {
    const nodes: Node[] = [];
    const iterator = this.nodeStore.childNodes();
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      nodes.push(value);
    }
    this.nodeStore.childNodes = () => toIterator<Node>(nodes);

    return toIterator(nodes);
  }

  [Symbol.iterator]() {
    return this.nodeStore.childNodes()
  }
}
