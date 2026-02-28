import { Future } from "../types/Future";
import { NamedNodeMap } from "./NamedNodeMap";
interface AttributeStore {
    attributes: Future<NamedNodeMap>;
}
export declare class DOMStringMap {
    private store;
    constructor(store: AttributeStore);
    private get;
    private set;
}
export {};
