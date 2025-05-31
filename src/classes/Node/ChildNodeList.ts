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
    let position = 0;
    let result: Node | null = null;
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      nodes.push(value);
      if (index === position) {
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
