import { NodeList } from "../NodeList";
import { Node } from "./Node";
import { NodeStore } from "./NodeStore";
export declare class ChildNodeList<NV> extends NodeList {
    nodeStore: NodeStore<NV>;
    constructor(nodeStore: NodeStore<NV>);
    get length(): number;
    item(index: number): Node<any> | null;
    forEach(callback: (currentValue: Node, currentIndex: number, listObj: NodeList) => void): undefined;
    keys(): ArrayIterator<number>;
    entries(): ArrayIterator<[number, Node<null>]>;
    values(): ArrayIterator<Node<any>>;
    [Symbol.iterator](): ArrayIterator<Node<any>>;
}
