import { CssNode, CssElement } from "../types/CssSelectTypes";
type Predicate<T> = (value: T) => boolean;
export declare class CssSelectAdapter {
    isTag(node: CssNode): node is CssElement;
    getChildren(node: CssNode): CssNode[];
    getParent(node: CssElement): CssNode | null;
    private getNodeParent;
    removeSubsets(inputNodes: CssNode[]): CssNode[];
    existsOne(test: Predicate<CssElement>, elems: CssNode[]): boolean;
    getSiblings(node: CssNode): CssNode[];
    getAttributeValue(elem: CssElement, name: string): string | undefined;
    hasAttrib(elem: CssElement, name: string): boolean;
    getName(elem: CssElement): string;
    findOne(test: Predicate<CssElement>, elems: CssNode[]): CssElement | null;
    findAll(test: Predicate<CssElement>, nodes: CssNode[]): CssElement[];
    getText(node: CssNode): string;
}
export {};
