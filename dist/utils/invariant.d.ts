declare class InvariantError extends Error {
    constructor(message: string);
}
export declare function invariant(condition: unknown, message: string): asserts condition;
export declare namespace invariant {
    var InvariantError: {
        new (message: string): InvariantError;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
}
export {};
