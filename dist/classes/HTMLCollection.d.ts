import { Element } from "./Element";
export declare abstract class HTMLCollection {
    abstract get length(): number;
    abstract item(index: number): Element | null;
    abstract namedItem(key: string): Element | null;
}
