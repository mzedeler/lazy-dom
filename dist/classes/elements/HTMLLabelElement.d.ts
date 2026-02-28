import { HTMLElement } from "./HTMLElement";
export declare class HTMLLabelElement extends HTMLElement {
    get htmlFor(): string;
    set htmlFor(value: string);
    get form(): null;
    get control(): import("../Element").Element | null;
}
