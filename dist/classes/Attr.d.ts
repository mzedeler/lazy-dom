import { NodeTypes } from "../types/NodeTypes";
import { Element } from "./Element";
export declare class Attr {
    constructor(ownerElement: Element | null, localName: string, value: string, namespaceURI?: string | null, prefix?: string | null);
    ownerElement: Element | null;
    readonly localName: string;
    value: string;
    readonly namespaceURI: string | null;
    readonly prefix: string | null;
    readonly specified = true;
    readonly nodeType = NodeTypes.ATTRIBUTE_NODE;
    readonly parentNode: null;
    readonly nextSibling: null;
    readonly previousSibling: null;
    readonly childNodes: never[];
    readonly attributes: null;
    get name(): string;
    get nodeName(): string;
    get nodeValue(): string;
    set nodeValue(val: string);
}
