import { HTMLElement } from "./HTMLElement";
export declare class HTMLTableRowElement extends HTMLElement {
    get rowIndex(): number;
    get sectionRowIndex(): number;
    get align(): string;
    set align(value: string);
    get bgColor(): string;
    set bgColor(value: string);
    get ch(): string;
    set ch(value: string);
    get chOff(): string;
    set chOff(value: string);
    get vAlign(): string;
    set vAlign(value: string);
    insertCell(): null;
    deleteCell(): void;
}
