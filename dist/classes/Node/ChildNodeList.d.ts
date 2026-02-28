import { NodeList } from "../NodeList";
import { Node } from "./Node";
import { NodeStore } from "./NodeStore";
export declare class ChildNodeList extends NodeList {
    [index: number]: Node | undefined;
    nodeStore: NodeStore;
    constructor(nodeStore: NodeStore);
    get length(): number;
    item(index: number): Node | null;
    forEach(callback: (currentValue: Node, currentIndex: number, listObj: NodeList) => void): undefined;
    keys(): ArrayIterator<number>;
    entries(): ArrayIterator<[number, Node]>;
    values(): ArrayIterator<Node>;
    [Symbol.iterator](): ArrayIterator<Node>;
}
