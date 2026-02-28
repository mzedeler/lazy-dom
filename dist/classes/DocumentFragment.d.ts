import { Node } from "./Node/Node";
export declare class DocumentFragment extends Node {
    readonly nodeName = "#document-fragment";
    constructor();
    get nodeValue(): null;
    set nodeValue(_value: any);
    get textContent(): string;
    protected _cloneNodeShallow(): DocumentFragment;
}
