import { HTMLElement } from "./HTMLElement";
export declare class HTMLFormElement extends HTMLElement {
    get action(): string;
    set action(value: string);
    get method(): string;
    set method(value: string);
    get enctype(): string;
    set enctype(value: string);
    get target(): string;
    set target(value: string);
    get name(): string;
    set name(value: string);
    get acceptCharset(): string;
    set acceptCharset(value: string);
    get length(): number;
    submit(): void;
    reset(): void;
}
