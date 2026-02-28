import { HTMLElement } from "./HTMLElement";
export declare class HTMLOptionElement extends HTMLElement {
    private _selected;
    private _value;
    get form(): null;
    get defaultSelected(): boolean;
    set defaultSelected(value: boolean);
    get text(): string;
    get index(): number;
    get disabled(): boolean;
    set disabled(value: boolean);
    get label(): string;
    set label(value: string);
    get selected(): boolean;
    set selected(value: boolean);
    get value(): string;
    set value(v: string);
}
