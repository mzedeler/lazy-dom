export declare class JSDOM {
    private _window;
    constructor(_html?: string, _options?: Record<string, unknown>);
    get window(): any;
    serialize(): string;
}
