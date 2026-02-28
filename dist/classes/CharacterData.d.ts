import { NodeTypes } from "../types/NodeTypes";
import { Node } from "./Node/Node";
export declare abstract class CharacterData extends Node {
    constructor(nodeType: NodeTypes);
    abstract get data(): string;
    abstract set data(data: string);
    get nodeValue(): string;
    set nodeValue(value: string);
    get textContent(): string;
    get length(): number;
    appendData(data: string): void;
    deleteData(offset: number, count: number): void;
    insertData(offset: number, arg: string): void;
    replaceData(offset: number, count: number, arg: string): void;
    substringData(offset: number, count: number): string;
}
