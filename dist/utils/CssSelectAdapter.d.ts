import { Element } from "../classes/Element";
import { Node } from "../classes/Node/Node";
import { NodeList } from "../classes/NodeList";
type NodeTest = (node: Node) => boolean;
export declare class CssSelectAdapter {
    isTag(node: Node): node is Element;
    getChildren(node: Node): Node[];
    getParent(element: Node): Node | null;
    removeSubsets(inputNodes: Node[]): Node[];
    existsOne(test: NodeTest, nodes: NodeList): boolean;
    getSiblings(node: Node): Node[];
    getAttributeValue(element: Element, attributeName: string): string | undefined;
    hasAttrib(element: Element, attributeName: string): boolean;
    getName(element: Element): string;
    findOne(test: NodeTest, nodes: Node[]): Node | null | undefined;
    findAll(test: NodeTest, nodes: Node[]): Node[];
    getText(input: Node[] | Node): string | undefined;
}
export {};
