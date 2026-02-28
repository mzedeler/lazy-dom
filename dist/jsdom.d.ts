export declare class JSDOM {
    private _window;
    constructor(_html?: string, _options?: Record<string, any>);
    get window(): any;
    serialize(): string;
}
