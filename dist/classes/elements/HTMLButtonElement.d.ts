import { HTMLElement } from "./HTMLElement";
export declare class HTMLButtonElement extends HTMLElement {
    get type(): string;
    set type(value: string);
    get name(): string;
    set name(value: string);
    get value(): string;
    set value(val: string);
    get disabled(): boolean;
    set disabled(val: boolean);
    get form(): null;
}
