import { Future } from "../types/Future";
import { CharacterData } from "./CharacterData";
declare class TextStore {
    data: Future<string>;
}
export declare class Text extends CharacterData {
    textStore: TextStore;
    nodeName: string;
    constructor();
    get textContent(): string;
    get data(): string;
    set data(data: string);
    get nodeValue(): string;
    set nodeValue(value: string);
    protected _cloneNodeShallow(): Text;
    splitText(offset: number): Text;
}
export {};
