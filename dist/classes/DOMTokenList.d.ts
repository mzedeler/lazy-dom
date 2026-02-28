import { Future } from "../types/Future";
import { NamedNodeMap } from "./NamedNodeMap";
interface AttributeStore {
    attributes: Future<NamedNodeMap>;
}
export declare class DOMTokenList {
    private store;
    constructor(store: AttributeStore);
    add(cls: string): void;
    remove(cls: string): void;
    contains(cls: string): boolean;
    toggle(cls: string): void;
}
export {};
