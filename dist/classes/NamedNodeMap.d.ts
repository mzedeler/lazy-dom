import { Future } from "../types/Future";
import { Attr } from "./Attr";
declare class NamedNodeMapStore {
    itemsLookup: Future<Record<string, Attr>>;
}
export declare class NamedNodeMap {
    namedNodeMapStore: NamedNodeMapStore;
    get length(): number;
    item(index: number): Attr | null;
    setNamedItem(attr: Attr): Attr | null;
    getNamedItem(name: string): Attr | null;
    removeNamedItem(name: string): Attr | null;
    getNamedItemNS(namespaceURI: string | null, localName: string): Attr | null;
    setNamedItemNS(attr: Attr): Attr | null;
    removeNamedItemNS(namespaceURI: string | null, localName: string): Attr | null;
    [Symbol.iterator](): Generator<Attr, void, unknown>;
}
export {};
