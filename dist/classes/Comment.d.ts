import { CharacterData } from "./CharacterData";
export declare class Comment extends CharacterData {
    readonly nodeName = "#comment";
    private _data;
    constructor(data?: string);
    get data(): string;
    set data(data: string);
    get nodeValue(): string;
    set nodeValue(value: string);
    protected _cloneNodeShallow(): Comment;
}
