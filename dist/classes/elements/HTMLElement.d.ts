import { Element } from "../Element";
export declare class HTMLElement extends Element {
    get id(): string;
    set id(value: string);
    get title(): string;
    set title(value: string);
    get lang(): string;
    set lang(value: string);
    get dir(): string;
    set dir(value: string);
    get className(): string;
    set className(value: string);
    get tabIndex(): number;
    set tabIndex(value: number);
    get accessKey(): string;
    set accessKey(value: string);
    get draggable(): boolean;
    set draggable(value: boolean);
}
