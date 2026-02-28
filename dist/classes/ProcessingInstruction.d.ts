import { Node } from "./Node/Node";
export declare class ProcessingInstruction extends Node {
    readonly target: string;
    constructor(target: string, data: string);
    get nodeName(): string;
    get data(): string;
    set data(data: string);
    get nodeValue(): string;
    set nodeValue(value: string);
    readonly attributes: null;
    protected _cloneNodeShallow(): ProcessingInstruction;
}
