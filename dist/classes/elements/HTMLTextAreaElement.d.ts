import { HTMLElement } from "./HTMLElement";
export declare class HTMLTextAreaElement extends HTMLElement {
    private _value;
    get form(): null;
    get defaultValue(): string;
    set defaultValue(value: string);
    get accessKey(): string;
    set accessKey(value: string);
    get cols(): number;
    set cols(value: number);
    get disabled(): boolean;
    set disabled(value: boolean);
    get name(): string;
    set name(value: string);
    get readOnly(): boolean;
    set readOnly(value: boolean);
    get rows(): number;
    set rows(value: number);
    get tabIndex(): number;
    set tabIndex(value: number);
    get type(): string;
    get value(): string;
    set value(v: string);
}
