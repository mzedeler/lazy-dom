import { Node } from './Node/Node';
export declare abstract class NodeList {
    abstract get length(): number;
    abstract item(index: number): Node | null;
    abstract entries(): Iterator<[number, Node]>;
    abstract forEach(callback: (currentValue: Node, currentIndex: number, listObj: NodeList) => void): undefined;
    abstract keys(): Iterator<number>;
    abstract values(): Iterator<Node>;
}
