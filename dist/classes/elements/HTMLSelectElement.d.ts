import { HTMLElement } from "./HTMLElement";
export declare class HTMLSelectElement extends HTMLElement {
    get type(): "select-multiple" | "select-one";
    get selectedIndex(): number;
    set selectedIndex(_value: number);
    get value(): string;
    set value(v: string);
    get length(): number;
    get form(): null;
    get disabled(): boolean;
    set disabled(value: boolean);
    get multiple(): boolean;
    set multiple(value: boolean);
    get name(): string;
    set name(value: string);
    get size(): number;
    set size(value: number);
    get tabIndex(): number;
    set tabIndex(value: number);
    add(): void;
    remove(): void;
}
