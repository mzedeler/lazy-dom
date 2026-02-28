export declare class Window {
    private _location;
    get location(): any;
    set location(value: any);
    getComputedStyle(): {
        getPropertyValue(): string;
    };
    matchMedia(mediaQueryString: string): {
        matches: boolean;
        media: string;
        onchange: null;
        addListener(): void;
        removeListener(): void;
        addEventListener(): void;
        removeEventListener(): void;
        dispatchEvent(): boolean;
    };
    addEventListener(): void;
    removeEventListener(): void;
    get localStorage(): {
        getItem(): null;
        setItem(): void;
    };
}
